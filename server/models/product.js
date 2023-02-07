import mongoose from 'mongoose';
import { APP_URL } from '../config';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    featured : {
        type : Boolean,
        default : false
    },
    rating : {
        type: Number,
        default : 4.5
    },
    image : {
        type : String,
        required : true,
        get : (image)=>{ return `${APP_URL}/${image}` }
    },
    company : {
        type : String,
        enum : {
            values: ['samsung', 'apple', 'dell', "lenovo"],
            message: `{VALUE} is not supported`
        }
    }

}, {timestamps : true, toJSON: {getters: true}, id: false});

export default mongoose.model('Product', productSchema, 'products');