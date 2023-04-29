import { Table, Column, Model, HasMany, IsUUID, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, Unique, AutoIncrement, DataType } from 'sequelize-typescript';
import { UserLog } from './UserLog';
import { Listing } from './Listing';
import { Optional } from 'sequelize';

/**
 * Helper interface for Users
 */
interface UserAttributes{
    id:string;
    username:string;
    email:string;
    access:string;
    reputation:number;
};
interface UserInput extends Optional
    <UserAttributes, 
    'id' | 'reputation'> {};
export interface UserOutput extends Required<UserAttributes> {};


@Table({
    tableName:'users',
    timestamps:true,
    paranoid:true
})
export class User extends Model<UserAttributes, UserInput> {
    @PrimaryKey
    @IsUUID(4)
    @Column(DataType.UUID)
    id!:string;

    @Unique
    @Column
    username!: string;

    @Column
    email!: string;

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
    readonly createdAt!: Date;

    @DeletedAt
    @Column
    readonly deletedAt!: Date;

    @UpdatedAt
    @Column
    readonly updatedAt!: Date;

};