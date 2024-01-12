import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req,res) => {
    res.json({
        message : 'API is working!',
    })
};

export const updateUser = async (req, res, next) =>{
    // whether the user that trying to update is exact owner
    if(req.user.id !== req.params.id) { //params is id value come from endpoint
        return next(errorHandler(401,'You can only update your account !'))
    }
    //else (exact owner/ authorized user)
    try{
        //if body has password
        if(req.body.password) {
            //encrypt
            req.body.password =  bcryptjs.hashSync(req.body.password,10);
        }
        //update user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                //pass only updated feilds
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            //to get new updated values on form feilds
            {new: true}
        );
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
   // whether the user that trying to update is exact owner
   //req.user.id (veifyToken -> id)
   //req.param.id (id comming from the endpoint)
   if(req.user.id !== req.params.id) { 
    return next(errorHandler(401,'You can only delete your account !'))
}
//else (exact owner/ authorized user)
try{
    //delete user
     await User.findByIdAndDelete(
        req.params.id,
    );
    res.status(200).json('User has been deleted !!!')
} catch (error) {
    next(error)
}
}