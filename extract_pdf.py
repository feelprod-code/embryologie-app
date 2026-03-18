import fitz
import sys

def extract_content_flow(pdf_path):
    doc = fitz.open(pdf_path)
    output = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # Get text blocks (type 0)
        blocks = [b for b in page.get_text("blocks") if b[6] == 0]
        
        # Create a list to hold all items (text and images) with their bounding boxes
        content_items = []
        
        for b in blocks:
            text = b[4].strip()
            if text:
                # b[0:4] is the bbox (x0, y0, x1, y1)
                content_items.append({
                    'type': 'text',
                    'bbox': b[:4],
                    'content': text
                })
                
        # Get images
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            # Get the bounding box of the image
            rects = page.get_image_rects(xref)
            for rect in rects:
                content_items.append({
                    'type': 'image',
                    'bbox': (rect.x0, rect.y0, rect.x1, rect.y1),
                    'content': f"\\n[IMAGE_PLACEHOLDER] (xref {xref})\\n"
                })
                
        # Sort items primarily by vertical position (y0), then horizontal (x0)
        content_items.sort(key=lambda x: (x['bbox'][1], x['bbox'][0]))
        
        output.append(f"--- PAGE {page_num + 1} ---")
        for item in content_items:
            output.append(item['content'])
            
    return "\n\n".join(output)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: extract_pdf.py <pdf_path>")
        sys.exit(1)
        
    print(extract_content_flow(sys.argv[1]))
