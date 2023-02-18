import mongoose from 'mongoose';

const modelChat =  mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        isGroupChat:{type: Boolean, default: false},
        user:[{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "chat_user"
        }],
        lastMessage:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "messageModel"
        },
        admin:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "chat_user"
        }

    },
    {
        timeStamps: true
    }
);
const finalChatModel = mongoose.model("ChatModel", modelChat);

export default finalChatModel