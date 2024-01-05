import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) => {
    // console.log(req.body);
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try{
        await newUser.save()
        res.status(201).json({message: "User created successfully!!!"});
    } catch(error){
        next(error);
    }
};   

export const signin = async(req,res,next) => {
    const {email, password} = req.body;
    try{
        //get the email from db of matching email got from client side
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found!'));
        //validate passwords for that paticular user email
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        //create web token
        //create secret key on .env file
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        //seperate password and rest of the details(passwrd shouldnt show)
        const {password: hashedPassword, ...rest} = validUser._doc;
        //create expiry date for the cookie
        const expireDate = new Date(Date.now() + 3600000); //1h
        //save token in a cookie
        res
            .cookie('access_token', token, {httpOnly:true, expires: expireDate}) //prevent modifying from a trird party
            .status(200)
            .json(validUser) //get user details for displaying
    } catch(error){
        next(error);
    }
}

//install json web token to the root
//npm i jsonwebtoken