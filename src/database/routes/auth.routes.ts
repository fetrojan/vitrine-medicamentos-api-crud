import { Router, Response, Request } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

authRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userBody = req.body

        const user = await userRepository.findOne({where: {email: userBody.email},
        relations: ['roles'],
        select: {
            roles: {
                id: true,
                description: true,
                permissions: {
                    id: true,
                    description: true
                }
            }
        }})

        if(!user) {
            res.status(400).json("Usuário não encontrado!")
            return
        }

        const valido = await bcrypt.compare(userBody.senha, user.senha)

        if(valido){

            const payload = {
                email: user.email,
                userId: user.id,
                roles: JSON.stringify(user.roles)
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})

            res.status(200).json({token: token})
            return
        } else {
            res.status(401).json("Usuário ou senha inválidos!")
            return
        }


    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

export default authRouter;