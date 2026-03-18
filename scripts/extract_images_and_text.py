import fitz
import sys
import os
import re
import json

def process_pdf(pdf_path, output_category, heading_regex, output_json_filename):
    """
    Extracts text and images from a PDF, grouping them by sections defined by a regex.
    Saves images to public/images/schemas/{output_category}/...
    Outputs a JSON file with the reconstructed markdown for each section.
    """
    base_image_dir = f"public/images/schemas/{output_category}"
    os.makedirs(base_image_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    
    current_section = "Intro"
    sections = {} # { section_name: [(type, content_or_path), ...] }
    sections[current_section] = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        content_items = []
        
        # 1. Text blocks
        blocks = [b for b in page.get_text("blocks") if b[6] == 0]
        for b in blocks:
            text = b[4].strip()
            if text:
                content_items.append({
                    'type': 'text',
                    'bbox': b[:4],
                    'content': text
                })
                
        # 2. Images
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            rects = page.get_image_rects(xref)
            for rect in rects:
                content_items.append({
                    'type': 'image',
                    'bbox': (rect.x0, rect.y0, rect.x1, rect.y1),
                    'xref': xref
                })
                
        # Sort items by Y, then X
        content_items.sort(key=lambda x: (x['bbox'][1], x['bbox'][0]))
        
        # Process items
        for item in content_items:
            if item['type'] == 'text':
                # Check if this text block is a new heading that starts a new section
                text = item['content']
                # Look for heading pattern, e.g., "2 - APPROCHE..." or "3 SYSTEMES VEINEUX"
                match = re.search(heading_regex, text)
                if match:
                    current_section = text.split('\n')[0].strip() # Take just the first line as heading
                    if current_section not in sections:
                        sections[current_section] = []
                
                sections[current_section].append(('text', text))
                
            elif item['type'] == 'image':
                # Extract image bytes
                base_image = doc.extract_image(item['xref'])
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                sections[current_section].append(('image', {
                    'bytes': image_bytes,
                    'ext': image_ext,
                    'xref': item['xref']
                }))

    # Now we have organized sections, time to save images and generate markdown
    final_output = {}
    
    for section_name, items in sections.items():
        if not items:
            continue
            
        markdown_lines = [f"# {section_name}\n"]
        img_counter = 1
        
        # We need a safe folder name based on the section, but we might have to map this later.
        # For now, use the section name but slugified, or let's create a generic slug like "section-X"
        # We'll use a clean version of the first word if it's a number
        match = re.search(r'^(\d+)', section_name)
        if match:
            folder_id = f"{output_category}-{match.group(1)}"
        else:
            folder_id = f"{output_category}-intro"
            
        section_image_dir = os.path.join(base_image_dir, folder_id)
        
        for item_type, item_data in items:
            if item_type == 'text':
                # Exclude the heading line itself if it matches exactly to avoid duplicating the # heading
                if item_data != section_name and item_data != "--- PAGE ---":
                    markdown_lines.append(item_data)
            elif item_type == 'image':
                os.makedirs(section_image_dir, exist_ok=True)
                img_filename = f"{output_category.capitalize()}_{img_counter}.{item_data['ext']}"
                img_path = os.path.join(section_image_dir, img_filename)
                
                # Write image
                with open(img_path, "wb") as f:
                    f.write(item_data['bytes'])
                
                # Add markdown tag
                rel_img_path = f"/images/schemas/{output_category}/{folder_id}/{img_filename}"
                markdown_lines.append(f"\n![Schéma]({rel_img_path})\n")
                img_counter += 1
                
        final_output[section_name] = "\n\n".join(markdown_lines)
        
    with open(output_json_filename, "w", encoding='utf-8') as f:
        json.dump(final_output, f, ensure_ascii=False, indent=2)
        
    print(f"Extraction complete for {output_category}. Saved JSON to {output_json_filename}")

if __name__ == "__main__":
    if sys.argv[1] == "oeil":
        process_pdf("scripts/pdfs_cours/0-L'OEIL-Marc Damoiseaux.pdf", "oeil", r"^\d+\s*-", "scripts/pdfs_cours/oeil_parsed.json")
    elif sys.argv[1] == "meso":
        process_pdf("scripts/pdfs_cours/EMBRYO NOTES.pdf", "mesoderme", r"^\d*\s*[A-Z]{3,}", "scripts/pdfs_cours/meso_parsed.json")
    else:
        print("Argument must be 'oeil' or 'meso'")
