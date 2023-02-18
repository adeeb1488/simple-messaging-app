import express from 'express';
import currentUser from '../authMiddleware.js';
import { sendMessage, displayMessages } from '../controllers/message.js';
const router = express.Router()

router.route('/').post(currentUser,sendMessage)
router.route('/:chatId').get(currentUser,displayMessages)

export default router