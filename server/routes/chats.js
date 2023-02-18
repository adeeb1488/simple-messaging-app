import express from 'express';
import currentUser from '../authMiddleware.js';
import {accessChat, allChats, newGroupChat, editGroupName, addUser,removeUser } from '../controllers/chat.js';


const router = express.Router()

router.route('/accesschat').post(currentUser, accessChat);
router.route("/").get(currentUser, allChats);
router.route("/group").post(currentUser, newGroupChat);
router.route('/editgroupname').put(currentUser, editGroupName)
router.route("/adduser").put(currentUser,addUser)
router.route("/removeuser").put(currentUser, removeUser);


export default router;