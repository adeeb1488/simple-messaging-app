import asyncHandler from 'express-async-handler'
import User from '../models/user.js'
import tokenGenerate from '../config/token.js';
export const register = asyncHandler(async(req,res) => {
const {user_name,email,pass,profile_pic} = req.body
if(!user_name ||!email ||!pass){
    res.status(400)
    throw new Error("Check all the fields again.")
}

const alreadyUser = await User.findOne({email})
if(alreadyUser) 
{
    res.status(400);
    throw new Error("User already exists.")
}

const createUser = await User.create({
    user_name,
    email,
    pass,
    profile_pic
})

if(createUser){
    res.status(201).json({
        _id: createUser._id,
        user_name: createUser.user_name,
        email: createUser.email,
        profile_pic: createUser.profile_pic,
        token: tokenGenerate(createUser._id)
    })
}else{
    res.status(400);
    throw new Error('Failed to create user...')
}
});

export const login = asyncHandler(async(req,res) => {
const {email,pass} = req.body;
const userExists = await User.findOne({email});
if(userExists &&(await userExists.checkPass(pass))){
    res.json({
        _id: userExists._id,
        user_name: userExists.user_name,
        email: userExists.email,
        profile_pic: userExists.profile_pic,
        token: tokenGenerate(userExists._id)
    })
    
}
else{
    res.status(401);
    throw new Error("Invalid credentials. Please try again.")
}
});

export const displayUsers = asyncHandler(async(req,res) =>{
    const k = req.query.search?{
        $or:[
            {user_name:{$regex: req.query.search, $options: "i"} },
            {email:{$regex: req.query.search, $options:"i"}}
        ]
    }:{}
    
const searchedUsers = await User.find(k).find({_id:{$ne: req.user._id}})
// const searchedUsers = await User.find(k)
res.send(searchedUsers)
})


