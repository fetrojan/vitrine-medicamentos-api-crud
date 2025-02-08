import { AppDataSource } from "../data-source";
import { Permission } from "../entities/Permission";
import { Router, Response, Request } from 'express';
import { Role } from "../entities/Role";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User)
const roleRepository = AppDataSource.getRepository(Role)
const permissionRepository = AppDataSource.getRepository(Permission)

const rbacRouter = Router()

rbacRouter.get('listAllRoles', async (req: Request, res: Response) => {
    try{

        const roles = await roleRepository.find({
            relations: ['permissions']
        })

        res.status(200).json(roles)

    } catch {
        res.status(500).json('Erro ao buscar roles')
    }
})

rbacRouter.get('listAllPermissions', async (req: Request, res: Response) => {
    try{

        const permissions = await permissionRepository.find()

        res.status(200).json(permissions)

    } catch {
        res.status(500).json('Erro ao buscar permissions')
    }
})

rbacRouter.post('addRole', async (req: Request, res: Response) => {
    try{

        const roleBody = req.body as Role
        
        if(!roleBody.description){
            res.status(400).send('Descrição da role é obrigatória')
            return
        }

        await roleRepository.save(roleBody)

        res.status(201).json(roleBody)

    } catch {
        res.status(500).json('Erro ao adicionar role')
    }
})

rbacRouter.post('addPermission', async (req: Request, res: Response) => {
    try{

        const permissionBody = req.body as Permission
        
        if(!permissionBody.description){
            res.status(400).send('Descrição da permissão é obrigatória')
            return
        }

        await permissionRepository.save(permissionBody)

        res.status(201).json(permissionBody)
    } catch {
        res.status(500).json('Erro ao adicionar permissão')
    }
})

rbacRouter.get('addPermissionToRole', async (req: Request, res: Response) => {
    try{

        const permissionRoleBody = req.body as {
            permissionId: number,
            roleId: number
        }

        if(!permissionRoleBody.permissionId || !permissionRoleBody.roleId){
            res.status(400).json('Id da permissão e da role são obrigatórios')
            return
        }

        const permission = await permissionRepository.findOneBy({id: permissionRoleBody.permissionId})

        if(!permission){
            res.status(404).json('Permissão não encontrada')
            return
        }

        const role = await roleRepository.findOne({where: {
            id: permissionRoleBody.roleId
         }, relations: ['permissions']
        })

        if(!role){
            res.status(404).json('Role não encontrada')
            return
        }

        if(role.permissions.find(p => p.id === permission.id)){
            res.status(400).json('Role já possui essa permissão')
            return
        }

        role.permissions.push(permission)
        await roleRepository.save(role)

        res.status(201).json(role)

    } catch {
        res.status(500).json('Erro ao processar solicitação')
    }
})

rbacRouter.get('addRoleToUser', async (req: Request, res: Response) => {
    try{

        const userRoleBody = req.body as {
            roleId: number,
            userId: number
        }

        if(!userRoleBody.roleId || !userRoleBody.userId){
            res.status(400).json('Id da role e do usuário são obrigatórios')
            return
        }

        const role = await roleRepository.findOneBy({id: userRoleBody.roleId})

        if(!role){
            res.status(404).json('Role não encontrada')
            return
        }

        const user = await userRepository.findOne({where: {
            id: userRoleBody.userId
         }, relations: ['roles']
        })

        if(!user){
            res.status(404).json('Usuário não encontrado')
            return
        }

        if(user.roles.find(r => r.id === role.id)){
            res.status(400).json('Usuário já possui essa role')
            return
        }

        user.roles.push(role)
        await userRepository.save(user)

        res.status(201).json(user)
        
    } catch {
        res.status(500).json('Erro ao processar solicitação')
    }
})