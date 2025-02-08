import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './Role';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    senha: string

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({name: 'user_roles'})
    roles: Role[]
}