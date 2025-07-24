import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import dotenv from "dotenv";
dotenv.config();

 export const embeddingModel=new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    // model: "nvidia/nv-embedqa-e5-v5" || "sentence-transformers/all-MiniLM-L6-v2",
    // model: "nvidia/nv-embedqa-e5-v5" 
    //  model: "sentence-transformers/all-MiniLM-L6-v2",
    model:"BAAI/bge-base-en-v1.5",
   
})

export const getEmbedding=async(text)=>{
    const embedding=await embeddingModel.embedQuery(text);
    if (embedding.length !== 768) {
    throw new Error(`Expected 768 dims, got ${embedding.length}`);
  }
    return embedding;
}

