import { User } from '../models';
import { customErrorHandler } from '../services';
const admin = async (req, res, next)=>{
    try {
        const user = await User.findOne({_id: req.user._id});

        if(user.role === 'admin'){
            next();
        }else{
            return next(customErrorHandler.unAuthorized());
        }

    } catch (error) {
        return next(customErrorHandler.serverError());
    }
}

export default admin;