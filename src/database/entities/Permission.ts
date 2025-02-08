import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";


@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    createdAt: Date;

    @ManyToMany(() => Role, (role) => role.permissions)
    @JoinTable({name: 'role_permissions'})
    roles: Role[];
}