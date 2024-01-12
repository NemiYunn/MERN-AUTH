import jwt from "jsonwebtoken";
import {errorHandler} from './error.js'

export const verifyToken = (req,res,next) => {
    //get token from cookie (name -> access_token)
    const token = req.cookies.access_token;

    //**** to pass cookie we need install (to root ->
    //*** */ npm i cookie-parser )
    //*** import and initialize it in index.js*/

    //if there is no token
    if(!token) return next(errorHandler(401, "Log in first!"));
    //if there is a token (validate)
    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        //if not valid
        if(err) return next(errorHandler(401, 'Token is not valid!'));
        //else (valid)
        // req.user use in user controller update/delete func
        req.user = user;
        next();
    })
}