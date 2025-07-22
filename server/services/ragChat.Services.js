import db from "../config/astraClient.js";
import { getEmbedding } from "../utils/embedUtils.js";

export const retrieveContext=async(querry)=>{
    const embedding=await getEmbedding(querry);
    const collection= db.collection(process.env.ASTRA_DB_COLLECTION);


    const cursor=collection.find(null,{
        sort:{$vector:embedding},
        limit:10
    });


    const docs=await cursor.toArray();
    return docs.map((doc)=>doc.text);
}