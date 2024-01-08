import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
//install jwt to the root of the project (npm i jsonwebtoken)
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
        //_id is unique on db and malcious users dont know it
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

        //seperate password and rest of the details(passwrd shouldnt show)
        const {password: hashedPassword, ...rest} = validUser._doc;

        //create expiry date for the cookie
        const expireDate = new Date(Date.now() + 3600000); //1h

        //save token in a cookie
        res
            .cookie('access_token', token, {httpOnly:true, expires: expireDate}) //prevent modifying from a trird party
            .status(200)
            .json(rest) //get user details for displaying //insted of passing validUser pass rest (dont wanna show password to the client side)
    } catch(error){
        next(error);
    }
}

export const google = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
        //if user is available
        //create web token
        //create secret key on .env file
        //_id is unique on db and malcious users dont know it
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET); 
          //seperate password and rest of the details(passwrd shouldnt show)
        const {password: hashedPassword, ...rest} = user._doc;
        //create expiry date for the cookie
        const expireDate = new Date(Date.now() + 3600000); //1h
        //save token in a cookie
        res
            .cookie('access_token', token, {httpOnly:true, expires: expireDate}) //prevent modifying from a trird party
            .status(200)
            .json(rest) //get user details for displaying //insted of passing validUser pass rest (dont wanna show password to the client side)
        } else {
            //if user is not availble
            //have to save to the db
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) ;
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo,     
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET); 
            const {password: hashedPassword2, ...rest} = newUser._doc;
            const expireDate = new Date(Date.now() + 3600000); //1h
            res
            .cookie('access_token', token, {httpOnly:true, expires: expireDate}) //prevent modifying from a trird party
            .status(200)
            .json(rest) //get user details for displaying //insted of passing validUser pass rest (dont wanna show password to the client side)
        }
    }catch(error){
        next(error)
    }
}
