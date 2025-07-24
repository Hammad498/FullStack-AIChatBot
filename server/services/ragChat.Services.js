



// // services/ragChat.Services.js
// import db from "../config/astraClient.js";
// import { getEmbedding } from "../utils/embedUtils.js";

// export const retrieveContext = async (query) => {
//   // 🔍 BGE requires this prefix
//   const wrappedQuery = `Represent this sentence for searching relevant passages: ${query}`;
//   const embedding = await getEmbedding(wrappedQuery);

//   // ✅ Debug logs
//   console.log("🔍 Query:", wrappedQuery);
//   console.log("📐 Embedding length:", embedding.length);
//   console.log("📊 Embedding (preview):", embedding.slice(0, 5));

//   const collection = db.collection(process.env.ASTRA_DB_COLLECTION);

//   const cursor = collection.find(null, {
//     sort: { $vector: embedding },
//     limit: 5
//   });

//   const docs = await cursor.toArray();

//   // ✅ Log matched document count
//   console.log("📦 Matched Docs Count:", docs.length);
//   docs.forEach((doc, i) => {
//     console.log(`📄 Doc ${i + 1}:`, doc.text?.slice(0, 100)); 
//   });

//   return docs.map((doc) => doc.text);
// };




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

