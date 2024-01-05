import express from 'express';
//specifically import the signup function from the auth.controller.js file.
import {signup} from '../controllers/auth.controller.js'

//This creates an instance of the Express Router. The router allows you to 
//define routes and their corresponding handlers separately.
const router = express.Router();

//This is the controller function that will be called when a POST request
// is made to the "/signup" endpoint. 
//The signup function is imported from the auth.controller.js file.
router.post("/signup",signup)

export default router;