import jwt from 'jsonwebtoken';
import User from './models/user.js'
import asyncHandler from 'express-async-handler';

const currentUser = asyncHandler(async (req, res, next) => {
    let userToken;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        userToken = req.headers.authorization.split(" ")[1];
  
        //decodes token id
        const decodeToken = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
  
        req.user = await User.findById(decodeToken.id).select("-pass");
  
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  
    if (!userToken) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });

export default currentUser