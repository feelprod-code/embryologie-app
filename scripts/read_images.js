import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const imageDir = "/Users/philippeguillaume/Desktop/IA 1";
const files = [
  "Ia1.png", "ia2.png", "Ia3.png", "Ia4.png", "Ia5.png",
  "Ia6.png", "Ia7.png", "Ia8.png", "Ia9.png", "IA 10.png"
];

function fileToGenerativePart(filePath) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType: "image/png"
    },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let fullPrompt = "Please extract the text from this image exactly as it is written. Do not add comments or summaries. Just output the text.";
  let fullTranscript = "";
  
  for (const file of files) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(imageDir, file);
      if (!fs.existsSync(filePath)) {
          console.warn(`${filePath} not found`);
          continue;
      }
      const imagePart = fileToGenerativePart(filePath);
      try {
          const result = await model.generateContent([fullPrompt, imagePart]);
          const response = await result.response;
          const text = response.text();
          fullTranscript += `\n--- ${file} ---\n${text}\n`;
      } catch (e) {
          console.error(`Error on ${file}:`, e);
      }
  }

  fs.writeFileSync(path.join(imageDir, "transcript.txt"), fullTranscript);
  console.log("Done. Transcript saved to transcript.txt");
}

run();
