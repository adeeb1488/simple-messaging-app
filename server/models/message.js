import mongoose from 'mongoose';

const modelMessage = mongoose.Schema(
    {
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chat_user"    
        
        },
        messageContent: {
            type: String,
            trim: true
        },

        chat:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatModel" 
        }


    },
    {
        timeStamps: true
    }
);
const finalMessageModel = mongoose.model("messageModel", modelMessage);
export default finalMessageModel