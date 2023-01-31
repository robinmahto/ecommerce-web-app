import joi from 'joi';
import { customErrorHandler } from '../../services';

const registerController = {
     
   async register(req, res, next){

        // validation
        const registerSchema = joi.object({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: joi.ref('password')
        })

       const { error }  = registerSchema.validate(req.body)

       if(error){
         return next(error);
       }

      // check if user is in the database already
       try {
         const exist = await User.exists({email: req.body.email})
         if(exist){
            return next(customErrorHandler.alreadyExist('This email is already exists'));
         }
       } catch (error) {
           return next(error);
       }

        res.json({message: 'user register successfully'})
    }
    
}

export default registerController;