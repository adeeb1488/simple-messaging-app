// import { group } from 'console';
import asyncHandler from 'express-async-handler';
// import chat from '../models/chat.js'
import finalChatModel from '../models/chat.js';
// import User from '../models/user.js'
import finalUserModel from '../models/user.js';
export const accessChat = asyncHandler(async (req,res) =>{
    const {user_id} = req.body;

    if(!user_id)
    {
        console.log('User ID is required...')
        return res.sendStatus(400);
    }

    var chat_exists = await finalChatModel.find({
        isGrouptChat: false,
        $and:[
            {user: {$elemMatch:{$eq: req.user._id }}},
            {user: {$elemMatch:{$eq: user_id }}},

        ]
    }).populate("user", "-pass").populate("lastMessage")

    chat_exists = await finalUserModel.populate(chat_exists,{ 
        path:"lastMessage.sentBy",
        select:"user_name profile_pic email"

    })
    console.log(chat_exists.length)
    if(chat_exists.length > 0)
    {
        res.send(chat_exists[0])
    }
    else{
        var newChatData = {
            name: 'sender',
            isGrouptChat: false,
            user:[req.user._id,user_id]
        }

    try{
        const chatCreation = await finalChatModel.create(newChatData)
        const fullChat = await finalChatModel.findOne({_id: chatCreation._id}).populate("user", "-pass")
        res.status(200).json(fullChat)
        // res.send(fullChat)
    } catch(err)
    {
        res.status(400)
        throw new Error(err.message);
    }
    }
})

 export const allChats = asyncHandler(async(req,res) =>{
    try{
        finalChatModel.find({user:{$elemMatch:{$eq:req.user._id}}})
        .populate("user", "-pass")
        .populate("admin", "-pass")
        .populate("lastMessage")
        .sort({updatedAt: -1})
        .then(async(r) =>{
            r = await finalUserModel.populate(r,{
                path:'lastMessage.sentBy',
                select:'user_name profile_pic email',
        
            })
            res.status(200).send(r);
        })
    } 
    catch(err)
    {
        res.status(400)
        throw new Error(err.message)
    }
})

export const newGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.user || !req.body.name)
    {
        return res.status(400).send({message: "All fields are required."})
    }

    let group_users = JSON.parse(req.body.user);

    if(group_users.length <2)
    {
        return res.status(400).send("A group can only be created with more than 2 users")
    }
    group_users.push(req.user)

    try{
        const groupChat = await finalChatModel.create({
            name: req.body.name,
            user: group_users,
            isGroupChat: true,
            admin: req.user
        })
        const completeGroupChat = await finalChatModel.findOne({_id: groupChat._id})
        .populate("user", "-pass")
        .populate("admin", "-pass")

        res.status(200).json(completeGroupChat)
    }


    catch(err){
        res.status(400)
        throw new Error(err.message);
    }
})

export const editGroupName = asyncHandler(async(req,res)=>{
    const{chat_id,chat_name} = req.body;
    const newChatName = await finalChatModel.findByIdAndUpdate(
        chat_id,
        {name:chat_name},
        {new:true}
    ).populate('user','-pass')
    .populate('admin','-pass')

    if(!newChatName)
    {
        res.status(404)
        throw new Error("The chat does not exist. Please try again.")
    }
    else{
        res.json(newChatName)
    }
})

export const addUser = asyncHandler(async(req,res)=>{
    const {chat_id, user_id} = req.body;
    const user_added = await finalChatModel.findByIdAndUpdate(
        chat_id,
        {
            $push:{user: user_id}
            
        },
        {new:true}
    )
    .populate('user', '-pass')
    .populate('admin', '-pass')

    if(!user_added)
    {
        res.status(404);
        throw new Error("The chat does not exit.")
    }
    else{
        res.json(user_added);
    }
})

export const removeUser = asyncHandler(async(req,res)=>{
    const {chat_id, user_id} = req.body;
    const user_removed = await finalChatModel.findByIdAndUpdate(
        chat_id,
        {
            $pull:{user: user_id}
            
        },
        {new:true}
    )
    .populate('user', '-pass')
    .populate('admin', '-pass')

    if(!user_removed)
    {
        res.status(404);
        throw new Error("The chat does not exit.")
    }
    else{
        res.json(user_removed);
    }
})
// export default allChats