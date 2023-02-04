import { customErrorHandler, JwtService } from '../services';

const auth = async(req, res, next)=>{
   const authHeader = req.headers.authorization;
   if(!authHeader){
     return next(customErrorHandler.unAuthorized());
   }
   const token = authHeader.split(' ')[1];

   try {
     const {_id, email} = JwtService.verify(token);
     const user = {_id, email};
     req.user = user;
     next();
   } catch (error) {
     return next(customErrorHandler.unAuthorized());
   }
   
}

export default auth