import { NextApiRequest, NextApiResponse } from "next"

type Data = { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){

        default:
            return res.status(400).json({
                message: 'No existe un endpoint aqui'
            })
    }
}
