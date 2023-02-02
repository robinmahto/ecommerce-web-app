import express from 'express';
import { registerController, loginController } from '../controllers';
const router  = express.Router();

router.get('/', (req, res)=>{
    res.json({message:'welcome to ecommerce server'})
})

router.post('/register', registerController.register)
router.post('/login', loginController.login)

export default router;