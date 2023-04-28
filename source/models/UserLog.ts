import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, BelongsTo, UpdatedAt, IsUUID, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './User';
import { Optional } from 'sequelize';

export interface Log{
    // TODO: keys for db logs
    action?:'GET'|'PUT'|'DELETE'|'POST';
};


export interface UserLogModel extends Optional<any,string>{
    id:string;
    log:Log;

};



@Table({
    tableName:'userLogs'
})
export class UserLog extends Model {
    @PrimaryKey
    @IsUUID(4)
    @Column
    id:string;

    @Column(DataType.JSON)
    log:Log;

    @ForeignKey(()=>User)
    @IsUUID(4)
    @Column(DataType.UUID)
    userId!:string;

    @BelongsTo(()=>User, 'userId')
    user!:User;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

};