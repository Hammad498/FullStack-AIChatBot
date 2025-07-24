// scripts/ingestData.js
import db from "../config/astraClient.js";
import { getEmbedding } from "../utils/embedUtils.js";
import dotenv from "dotenv";
dotenv.config();

const texts = [
  "Remote Jobs in Mexico City 🇲🇽",
  "Remote Jobs in Guadalajara 🇲🇽",
  "Senior Frontend Developer 🇨🇦 Canada $80k - $120k",
  "JavaScript Developer Roles Available Remotely",
  "Remote Jobs in Buenos Aires 🇦🇷"
  // ... more chunks
];

const collection = db.collection(process.env.ASTRA_DB_COLLECTION);

const ingest = async () => {
  for (const text of texts) {
    const wrapped = `Represent this sentence for searching relevant passages: ${text}`;
    const embedding = await getEmbedding(wrapped);
    await collection.insertOne({ text, $vector: embedding });
    console.log("✅ Inserted:", text);
  }
  process.exit(0);
};

