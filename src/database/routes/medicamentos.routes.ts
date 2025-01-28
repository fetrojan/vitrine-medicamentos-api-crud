import { Router, Response, Request } from 'express';
import { Medicamento } from '../entities/Medicamento';
import { AppDataSource } from '../data-source';

const medicamentoRouter = Router();

const medicamentoRepository = AppDataSource.getRepository(Medicamento);

medicamentoRouter.post('/', async (req: Request, res: Response) => {
    try {
        const medBody = req.body;

        if(!medBody.nome || !medBody.descricao || !medBody.quantidade || !medBody.userId) {
            res.status(400).json("Campos obrigatórios não preenchidos!")
            return
        }

        await medicamentoRepository.save(medBody);
        res.status(201).json("Medicamento cadastrado com sucesso!", medBody)

    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

medicamentoRouter.get('/', async (req: Request, res: Response) => {
    try {

        const userId = Number(req.headers.userid);

        if(!userId) {
            res.status(400).json("Será necessário informar o userId no header")
            return
        }

        const result = await medicamentoRepository.find({
            where: {
                userId: userId
            }
        });

        if(!result) {
            res.status(404).json("Nenhum medicamento encontrado!")
            return
        }

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

    

medicamentoRouter.get('/id', async (req: Request, res: Response) => {
    try {

        const result = await medicamentoRepository.findOne({
            where:{
                id: Number(req.params.id)
            }
        });

        if(!result) {
            res.status(404).json("Medicamento não encontrado!")
            return
        }

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

medicamentoRouter.get('/all', async (req: Request, res: Response) => {
    try {

        const result = await medicamentoRepository.find();

        if(!result) {
            res.status(404).json("Nenhum medicamento encontrado!")
            return
        }

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

medicamentoRouter.put('/id', async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        const userId = Number(req.headers.userid);

        if(!userId) {
            res.status(400).json("Será necessário informar o userId no header")
            return
        }

        const medBody = req.body as Medicamento

        const medicamento = await medicamentoRepository.findOne({where:{id: id, userId: userId}});

        if(!medicamento) {
            res.status(404).json("Medicamento não encontrado!")
            return
        }

        Object.assign(medicamento, medBody);

        await medicamentoRepository.save(medicamento);

        res.status(200).json("Medicamento atualizado com sucesso!", medicamento)


    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

medicamentoRouter.delete('/id', async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        const userId = Number(req.headers.userid);

        if(!userId) {
            res.status(400).json("Será necessário informar o userId no header")
            return
        }

        const medicamento = await medicamentoRepository.findOne({where:{id: id, userId: userId}});

        if(!medicamento) {
            res.status(404).json("Medicamento não encontrado!")
            return
        }

        await medicamentoRepository.delete(medicamento);

        res.status(200).json("Medicamento deletado com sucesso!", medicamento)

    } catch (error) {
        res.status(500).json("Não foi possivel executar a solicitação!")
    }
})

export default medicamentoRouter;