import { Optional } from "sequelize";
import { UUID } from "../sequelizeSetup";
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";



interface AuthTokenAttributes{
    authToken:string;
    userId:UUID;
};

export interface AuthTokenInput extends Optional<AuthTokenAttributes,never>{};
export interface AuthTokenOutput extends Required<AuthTokenAttributes>{};


@Table({
    tableName:"authTokens"
})
export class AuthToken extends Model<AuthTokenAttributes, AuthTokenInput>{
    @PrimaryKey
    @Column(DataType.CHAR(64))
    authToken:string;

    @ForeignKey(()=>User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId:UUID;

    @BelongsTo(()=>User, 'userId')
    user:User|undefined;

    @CreatedAt
    @Column
    readonly createdAt!: Date;
};