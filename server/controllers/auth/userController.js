import { User } from '../../models';
import { customErrorHandler } from '../../services';

const userController = {
    async users(req, res, next){
        try {
         const user = await User.findOne({_id: req.user._id}).select('-password -updatedAt -createdAt -__v');
         if(!user){
            return next(customErrorHandler.notFound());
         }
         res.json({message: user});
        } catch (error) {
          return next(err)
        }
        
     }
}

export default userController;