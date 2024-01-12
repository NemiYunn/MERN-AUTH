import express from 'express';
import {test , updateUser, deleteUser} from '../controllers/user.controller.js';
//in api(backend when impring js files, should mention.js)
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/',test);
//verifyToken (user authentication) => req.user comming from verifyUser.js
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id',verifyToken, deleteUser);

export default router;