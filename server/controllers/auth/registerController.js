import joi from 'joi';

const registerController = {
     
    register(req, res, next){

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


        res.json({message: 'user register successfully'})
    }
    
}

export default registerController;