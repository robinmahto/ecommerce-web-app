import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { product } from '../models';
import { customErrorHandler } from '../services';
import { productSchema } from '../validators';

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
      },

      update(req, res, next){
        // multipart form data
        handleMultipartData(req, res, async(err)=>{
            if(err){
              return next(customErrorHandler.serverError(err.message));
            }
            let filePath;
            if(req.file){
              filePath = req.file.path;
            }
            // validation
            const { error } = productSchema.validate(req.body);
            if(error){
              // delete the uploads file
              if(req.file){
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                  if(err){
                    return next(customErrorHandler.serverError(err.message))
                  }
                });
              }
              return next(customErrorHandler.serverError(err.message))
            }

            const { name, price, featured, rating, company } = req.body;
            let document;
            try {
              document = await product.findOneAndUpdate({_id: req.params.id },{
                name,
                price,
                featured,
                rating,
                company,
                ...(req.file && {image: filePath})
              }, {new: true})
            } catch (error) {
              return next(error);
            }

            res.json({message: document})
        })
      },

      async destroy(req, res, next){
        const document = await product.findOneAndRemove({_id: req.params.id});
        if(!document){
          return next(new Error('Nothing to delete'))
        }
        // image delete
        const imagePath = document.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
          if(err){
            return next(customErrorHandler.serverError());
          }
        });
        res.json({document})
      },

      async getAllProduct(req, res, next){
        let document
        try {
          document = await product.find().select('-updatedAt, -_v').sort({_id: -1});
        } catch (error) {
          return next(customErrorHandler.serverError());
        }
        res.json(document);
      }
}

export default productController;