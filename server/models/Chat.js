import mongoose from "mongoose";

const chatSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        default:"Untitled Chat"
    },
    message:[{
        role:{
            type:String,
            required:true
        },
        content:{
            type:String,
            required:true
        }
}],
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
}
})

export default mongoose.model("Chat",chatSchema);