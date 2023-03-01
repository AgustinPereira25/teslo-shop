import mongoose, { Schema, model, Model} from 'mongoose';
import { IProduct } from '../interfaces/products';


const productSchema = new Schema({
    description: { type: String, required: true, default: '' },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS','S','M','L','XL','XXL','XXXL'],
            message: "{VALUE} no es un tamaño válido"
        }
    }],
    slug: { type: String, required: true, unique:true },
    tags: [{ 
        type: String 
    }],
    title: { type: String, required: true, default: '' },
    type: { 
        type: String, 
        required: true, 
        enum:{ 
            values: ['shirts','pants','hoodies','hats'],
            message: "{VALUE} no es un tipo válido"
        },
        default: 'shirts'
    },
    gender: { 
        type: String, 
        required: true, 
        enum:{ 
            values: ['men','women','kid','unisex'],
            message: "{VALUE} no es un género válido"
        },
        default: 'women'
    }


}, {
    timestamps: true,
})


productSchema.index({ title: 'text', tags: 'text'});

const ProductModel: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

// const product = new ProductModel();

export default ProductModel;