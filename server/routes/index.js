import express from 'express';
import { registerController } from '../controllers';
const router  = express.Router();

router.get('/', (req, res)=>{
    res.json({message:'welcome to ecommerce server'})
})

router.post('/register', registerController.register)

export default router;