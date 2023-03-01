import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';


import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );



type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct( req, res);

        case 'POST':
            return createProduct( req, res)
        
        default:
            return res.status(400).json({ message: 'Bad Request!' });
    }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
     await db.connect();

     const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

     await db.disconnect();

     //TODO:
     //Tendremos que actualizar las imágenes
     const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });

        return product;
    });

     return res.status(200).json( updatedProducts );
}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if ( !isValidObjectId(_id) ){
        return res.status(400).json({ message: 'El id del prpoducto no es valido '} );
    }

    if( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes'} );
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asadsada.jpg


    try {
        
        await db.connect();
        //verificar que exista el prd.
        const prod = await Product.findById(_id);

        if (!prod) {
            return res.status(400).json({ message: 'No existe producto con ese ID'} ); 
            await db.disconnect();
        }

        // TODO: Eliminar fotos en Cloudinary
        //url: https://res.cloudinary.com/dnvdsnnso/image/upload/v1677533888/faetytouqu9fft8gaklc.webp
        prod.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                //Si alguna de las imagenes de la BD, no está, borrar de cloudinary
                const [fileId, extension] = image.substring( image.lastIndexOf('/') + 1 ).split('.');
                // resultado con split: [faetytouqu9fft8gaklc,webp]
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );

            }
        })

        await prod.update( req.body ); // Actualizamos el producto como venga.
        // prod.save();
        await db.disconnect();


        return res.status(200).json( prod );

    } catch (error) {
        console.log({error})
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor'} ); 
    }



}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if ( images.length < 2 ){
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });

    }
    // TODO: posiblemente tendremos un localhost:3000/products/asadsada.jpg

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug })
        if ( productInDB ){
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
            await db.disconnect();
        }
        
        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        res.status(201).json( product );

    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}

