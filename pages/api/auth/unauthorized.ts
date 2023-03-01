import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    return res.status(401).setHeader('Content-Type', 'application/json').json({ message: 'No autorizado' })

}