import joi from 'joi';
import bcrypt from 'bcrypt';
import { customErrorHandler, JwtService } from '../../services';
import { User } from '../../models';

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

      //  hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const { name, email} = req.body;
      const user = new User({name, email, password: hashedPassword});
      
      let access_token
      try {
        const result = await user.save();
        // token
        access_token = JwtService.sign({_id: result._id, email: result.email});

      } catch (error) {
        return next(error);
      }

        res.json({token: access_token})
    }
    
}

export default registerController;