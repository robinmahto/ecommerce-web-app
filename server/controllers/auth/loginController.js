import joi from 'joi';
import bcrypt from 'bcrypt';
import { User, RefreshToken } from '../../models';
import { customErrorHandler, JwtService } from '../../services';
import { JWT_REFRESH_SECRET } from '../../config';

const loginController = {
   async login(req, res, next){
         // validation
         const loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
         })
         const {error} = loginSchema.validate(req.body);
         if(error){
            return next(error);
         }

        try {

           // check email exists in db
            const user = await User.findOne({email: req.body.email});
            if(!user){
               return next(customErrorHandler.wrongCreadentials());
            }

            // compare password
            const passwordMatch = await bcrypt.compare(req.body.password, user.password)
            if(!passwordMatch){
               return next(customErrorHandler.wrongCreadentials());
            }

            // token
           const access_token = JwtService.sign({_id: user._id, email: user.email});
           const refresh_token = JwtService.sign({_id: user._id, email: user.email}, '1y', JWT_REFRESH_SECRET);
           // database whitelist
           await RefreshToken.create({token: refresh_token});

            res.json({access_token, refresh_token});
        } catch (error) {
            return next(error);;
        }
   }
}

export default loginController;