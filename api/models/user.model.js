import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps:true});


//This line creates a Mongoose model named 'User' 
//based on the defined schema. 
const User = mongoose.model('User',userSchema);

export default User; 