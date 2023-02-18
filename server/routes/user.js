import  express  from "express";
import {register, login, displayUsers} from '../controllers/user.js'
// import userAuthentication from '../controllers/user.js'
import currentUser from "../authMiddleware.js";
const router = express.Router();

router.route('/registration').post(register)
router.route('/login').post(login)
router.route('/').get(currentUser,displayUsers)
// router.post('/login', userAuthentication)

export default router;