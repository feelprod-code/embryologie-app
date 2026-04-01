import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const data = fs.readFileSync("/Users/philippeguillaume/Desktop/IA 1/IA 10.png");
  const result = await model.generateContent([
    "Décris avec précision textuelle et visuelle TOUT ce qui se trouve TOUT EN BAS de cette maquette, APRÈS la phrase 'J'espère que cette synthèse...'. Y a-t-il un bouton PDF ? De quelle couleur ? Y a-t-il d'autres textes, paragraphes, ou boutons ? Sois exhaustif.",
    { inlineData: { data: data.toString("base64"), mimeType: "image/png" } }
  ]);
  console.log(result.response.text());
}
run();
