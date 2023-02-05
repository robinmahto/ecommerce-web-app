import joi from 'joi';
import bcrypt from 'bcrypt';
import { customErrorHandler, JwtService } from '../../services';
import { User, RefreshToken } from '../../models';
import { JWT_REFRESH_SECRET } from '../../config';

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
      let refresh_token

      try {
        const result = await user.save();
        // token
        access_token = JwtService.sign({_id: result._id, email: result.email});
        refresh_token = JwtService.sign({_id: result._id, email: result.email}, '1y', JWT_REFRESH_SECRET);
        // database whitelist
        await RefreshToken.create({token: refresh_token});

      } catch (error) {
        return next(error);
      }

        res.json({access_token, refresh_token})
    }
    
}

export default registerController;