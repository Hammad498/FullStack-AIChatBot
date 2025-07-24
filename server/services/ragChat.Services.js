

// services/ragChat.Services.js
import db from "../config/astraClient.js";
import { getEmbedding } from "../utils/embedUtils.js";

export const retrieveContext = async (query) => {
  const wrappedQuery = `Represent this sentence for searching relevant passages: ${query}`;
  const embedding = await getEmbedding(wrappedQuery);
  const collection = db.collection(process.env.ASTRA_DB_COLLECTION);

  const cursor = collection.find(null, {
    sort: { $vector: embedding },
    limit: 5
  });

  const docs = await cursor.toArray();
  return docs.map((doc) => doc.text);
};

