import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    createdAt: Date;

    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable({name: 'user_roles'})
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({name: 'role_permissions'})
    permissions: Permission[];
}