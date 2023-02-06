import multer from 'multer';
import path from 'path';
import Joi from 'joi';
import fs from 'fs';
import { product } from '../models';
import { customErrorHandler } from '../services';

const storage = multer.diskStorage({
   destination : (req, file, cb)=>{
       cb(null, 'uploads/')
   },
   filename: ( req, file, cb )=>{
      const uniquename = `${Date.now()}-${Math.random() * 1E9}${path.extname(file.originalname)}`;
      cb(null, uniquename);
   }
})

const handleMultipartData = multer({storage, limits: {fileSize: 100000 * 5}}).single('image');

const productController = {
      async store(req, res, next){
        // multipart form data
        handleMultipartData(req, res, async(err)=>{
            if(err){
              return next(customErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            // validation
            const productSchema = Joi.object({
               name : Joi.string().required(),
               price : Joi.number().required(),
               featured : Joi.boolean(),
               rating : Joi.number(),
               company : Joi.string(),
            })

            const { error } = productSchema.validate(req.body);
            if(error){
              // delete the uploads file
              fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                if(err){
                  return next(customErrorHandler.serverError(err.message))
                }
              });
              return next(customErrorHandler.serverError(err.message))
            }

            const { name, price, featured, rating, company } = req.body;
            let document;
            try {
              document = await product.create({
                name,
                price,
                featured,
                rating,
                company,
                image: filePath
              })
            } catch (error) {
              return next(error);
            }

            res.json({message: document})
        })
      }
}

export default productController;