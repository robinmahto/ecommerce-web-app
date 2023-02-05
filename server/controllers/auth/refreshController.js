import Joi from "joi";
import { RefreshToken, User } from '../../models';
import { customErrorHandler, JwtService } from '../../services';
import { JWT_REFRESH_SECRET } from '../../config';

const refreshController = {
   async refresh(req, res, next){
    //   validation
    const refreshSchema = Joi.object({
        refresh_token : Joi.string().required(),
    })
    const { error } = refreshSchema.validate(req.body);
    if(error){
        return next(error);
    }
    // database check
    let refreshToken
    try {
        refreshToken = await RefreshToken.findOne({token: req.body.refresh_token});
        if(!refreshToken){
            return next(customErrorHandler.unAuthorized('Invalid refresh token'));
        }
        
        let userId
        try {
            const { _id } = JwtService.verify(refreshToken.token, JWT_REFRESH_SECRET);
            userId = _id;
        } catch (error) {
            return next(customErrorHandler.unAuthorized('Invalid refresh token'));
        }

        const user = await User.findOne({_id: userId})
        if(!user){
            return next(customErrorHandler.unAuthorized('No user found!'));
        }

         // token
         const access_token = JwtService.sign({_id: user._id, email: user.email});
         const refresh_token = JwtService.sign({_id: user._id, email: user.email}, '1y', JWT_REFRESH_SECRET);
         // database whitelist
         await RefreshToken.create({token: refresh_token});

         res.json({access_token, refresh_token});


    } catch (error) {
        return next(new Error('Something went wrong', error.message))
    }
   }
}

export default refreshController;