import { db, dbOrders } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

type Data = 
| { message: string }
| {
    numberOfOrders: number;
    paidOrders: number; // buscar isPaid true
    notPaidOrders: number; // buscar isPaid true
    numberOfClients: number; //role: client 
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; //Productos con 10 o menos
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getDashboardItems(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' });
    }

}

const getDashboardItems = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    // verificar la sesion del usuario
    // const session: any = await getSession({ req });

    // if( !session ){
    //     return res.status(401).json({ message: 'Debe estar autenticado para hacer esto '});
    // }

    await db.connect();

    try {
        //Consigo los elementos haciendo consultas a la BD
        // const numberOfOrders = await Order.estimatedDocumentCount();
        // const paidOrders = await Order.countDocuments({ isPaid: true });
        // const notPaidOrders = await Order.countDocuments({ isPaid: false });
        // const numberOfClients = await User.countDocuments({ role:'client' });
        // const numberOfProducts = await Product.estimatedDocumentCount();
        // const productsWithNoInventory = await Product.countDocuments({ inStock: 0 });
        // const lowInventory = await Product.countDocuments({ inStock: { $lte: 10 } }); //productos con <= 10 stock
        // *** Otra forma de hacer lowInventory ***
        // const lowInventoryWhere = await Product.$where('inStock').lte(10) //productos con <= 10 stock
        

        // ************ OTRA FORMA DE OBTENER ELEMENTOS CON PROMISE ALL *****************
        // Se ejecutan todas las consultas en paralelo (un poco más optima = de 30-40seg a 15-17seg consultando en postman)
        const [
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
        ] = await Promise.all([
            Order.estimatedDocumentCount(),
            Order.countDocuments({ isPaid: true }),
            Order.countDocuments({ isPaid: false }),
            User.countDocuments({ role:'client' }),
            Product.estimatedDocumentCount(),
            Product.countDocuments({ inStock: 0 }),
            Product.countDocuments({ inStock: { $lte: 10 } }), 
        ]);

        await db.disconnect();

        return res.status(200).json({
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
        });

    } catch (error: any) {
        await db.disconnect();
        // console.log(error);
        return res.status(400).json({ 
            message: error.message || 'Revise logs del servidor'
        })       
    }
}
