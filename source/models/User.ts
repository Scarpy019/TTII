import { Table, Column, Model, HasMany, IsUUID, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, Unique, AutoIncrement, DataType } from 'sequelize-typescript';
import { UserLog } from './UserLog';
import { Listing } from './Listing';
import { Optional } from 'sequelize';

export interface UserModel extends Optional<any,string>{
    id:string;
    username:string;
    email:string;
    access?:string;
    reputation?:number;
};

@Table({
    tableName:'users'
})
export class User extends Model {
    @PrimaryKey
    @IsUUID(4)
    @Column(DataType.UUID)
    id!:string;

    @Unique
    @Column
    username!: string;

    @Column
    email!: string;

    @Default("Client")
    @Column
    access!: string;
    
    @Default(0)
    @Column
    reputation!: number;

    @HasMany(()=>UserLog, 'userId')
    logs:UserLog[];

    @HasMany(()=>Listing, 'userId')
    listings:Listing[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

};