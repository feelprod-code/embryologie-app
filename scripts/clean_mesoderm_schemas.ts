import fs from 'fs';
import path from 'path';

function main() {
  const videoCoursesPath = path.join(process.cwd(), 'src', 'data', 'videoCourses.ts');
  let content = fs.readFileSync(videoCoursesPath, 'utf-8');

  // Regex to match markdown images for mesoderm and oeil: ![Alt text](/images/schemas/mesoderme/...)
  const mesodermImageRegex = /!\[.*?\]\(\/images\/schemas\/mesoderme\/.*?\)/g;
  const oeilImageRegex = /!\[.*?\]\(\/images\/schemas\/oeil\/.*?\)/g;
  
  // Also remove extra blank lines left behind by the removal
  let cleanedContent = content.replace(mesodermImageRegex, '');
  cleanedContent = cleanedContent.replace(oeilImageRegex, '');
  const finalContent = cleanedContent.replace(/\\n{3,}/g, '\\n\\n');

  fs.writeFileSync(videoCoursesPath, finalContent, 'utf-8');
  console.log("Successfully removed old Mesoderm schema tags from transcripts.");
}

main();
