import { Router, Response, Request } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';

import authenticate from '../../middleware/authenticate';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

userRouter.post('/', authenticate(["criar_usuario"]), async (req: Request, res: Response) => {
    try {
        const userBody = req.body;

        if(!userBody.name || !userBody.email || !userBody.senha) {
            res.status(400).json("Campos obrigatórios não preenchidos!")
            return
        }

        const salt = await bcrypt.genSalt(10)
        let senhaCriptografada = await bcrypt.hash(userBody.senha, salt)

        userBody.senha = senhaCriptografada

        await userRepository.save(userBody);
        res.status(201).json(userBody)
        return


    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

export default userRouter;