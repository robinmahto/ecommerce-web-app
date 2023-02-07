import Joi from "joi";

const productSchema = Joi.object({
    name : Joi.string().required(),
    price : Joi.number().required(),
    featured : Joi.boolean(),
    rating : Joi.number(),
    company : Joi.string(),
    image : Joi.string()
 })

export default productSchema;