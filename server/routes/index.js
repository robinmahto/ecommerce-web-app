import express from 'express';
import { registerController, loginController, userController, refreshController } from '../controllers';
import { auth } from '../middlewares';
const router  = express.Router();

router.get('/', (req, res)=>{
    res.json({message:'welcome to ecommerce server'});
})

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/users', auth, userController.users); // protected routes
router.post('/refreshtoken', refreshController.refresh);

export default router;