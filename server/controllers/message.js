import asyncHanlder from 'express-async-handler';
// import User from '../models/user.js'
// import Message from '../models/message.js'
// import Chat from '../models/chat.js'
import finalUserModel from '../models/user.js';
import finalChatModel from '../models/chat.js';
import finalMessageModel from '../models/message.js';
export const sendMessage = asyncHanlder( async (req,res)=>{
const { content, chatId} = req.body

if(!content || !chatId){
    console.log("Invalid data")
    return res.sendStatus(400);
}
console.log(req.user._id)
var newMessage ={
    sentBy: req.user._id,
    messageContent: content,
    chat: chatId
}

try{
    var message = await finalMessageModel.create(newMessage)
    message = await message.populate("sentBy", "user_name profile_pic")
    message = await message.populate("chat")
    message = await finalUserModel.populate(message,{
        path:"chat.user",
        select:"user_name profile_pic email"
    })

    await finalChatModel.findByIdAndUpdate(req.body.chatId,{
        lastMessage:message
    })
    res.json(message);
} catch(err){
    res.status(400)
    throw new Error;
}
})

export const displayMessages = asyncHanlder(async(req,res) =>{
   
    try{
        const messages = await finalMessageModel.find({chat:req.params.chatId}).populate("sentBy", "user_name profile_pic email")
        .populate("chat")
        res.json(messages)
    }catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})