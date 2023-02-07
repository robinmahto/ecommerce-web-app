import express from 'express';
import {
    registerController,
    loginController,
    userController,
    refreshController,
    productController
} from '../controllers';
import { auth, admin } from '../middlewares';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'welcome to ecommerce server' });
})

// Auth
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.post('/refreshtoken', refreshController.refresh);
router.post('/logout', auth, loginController.logout);
router.get('/users', auth, userController.users); // protected routes

// products
router.post('/product', [auth, admin], productController.store);
router.put('/product/:id', [auth, admin], productController.update);
router.delete('/product/:id', [auth, admin], productController.destroy);
router.get('/product', productController.getAllProduct);
router.get('/product/:id', productController.getSingleProduct);

export default router;