import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import dotenv from "dotenv";
dotenv.config();

 export const embeddingModel=new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    // model: "nvidia/nv-embedqa-e5-v5" || "sentence-transformers/all-MiniLM-L6-v2",
    // model: "nvidia/nv-embedqa-e5-v5" 
     model: "sentence-transformers/all-MiniLM-L6-v2",
})

export const getEmbedding=async(text)=>{
    const embedding=await embeddingModel.embedQuery(text);
    if (embedding.length !== 1536) {
    throw new Error(`Expected 1536 dims, got ${embedding.length}`);
  }
    return embedding;
}