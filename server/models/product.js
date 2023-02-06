import mongoose from 'mongoose';
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
        required : true
    },
    company : {
        type : String,
        enum : {
            values: ['samsung', 'apple', 'dell', "lenovo"],
            message: `{VALUE} is not supported`
        }
    }

}, {timestamps : true});

export default mongoose.model('Product', productSchema, 'products');