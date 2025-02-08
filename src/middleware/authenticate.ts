import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) {
            res.status(401).json("Token não informado!")
            return
        }

        const dadosToken = jwt.verify(token, process.env.JWT_SECRET)

        next()

    } catch (error) {
        res.status(401).json("Token Inválido!")
    }
}

export default authenticate