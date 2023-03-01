import mongoose, { Schema, model, Model} from 'mongoose';
import { IUser } from '@/interfaces/user';


const userSchema = new Schema({
    name: { type: String, required:true },
    email: { type: String, required:true, unique: true },
    password: { type: String, required:true },
    role: { 
        type: String,
        enum: {
            values:['admin','client', 'super-user', 'SEO'],
            message:'{VALUE} no es un role válido',
            default: 'client',
            required: true
        }
    },
}, {
    timestamps: true, //saber cuando se inserta un usuario, etc
})

const User:Model<IUser> = mongoose.models.User || model('User',userSchema);

export default User;