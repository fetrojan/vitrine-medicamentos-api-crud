import { Router, Response, Request } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';


const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

authRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userBody = req.body

        const user = await userRepository.findOne({where: {email: userBody.email}})

        if(!user) {
            res.status(400).json("Usuário não encontrado!")
            return
        }

        const valido = await bcrypt.compare(userBody.senha, user.senha)

        if(valido){
            res.status(200).json("Usuário autenticado com sucesso!")
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