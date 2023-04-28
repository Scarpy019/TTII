import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo, IsUUID, DataType } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { User } from './User';
import { Optional } from 'sequelize';


export interface ListingModel extends Optional<any,string>{
    title:string;
    body:string;
    status:string;
    start_price:number;
    is_auction:boolean;
    auction_end:Date;
};


@Table({
    tableName:'listings'
})
export class Listing extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!:number;

    @Column
    title!: string;

    @Column
    body!: string;

    @Column
    status:string;

    @Column
    start_price:number;

    @Column
    is_auction:boolean;

    @Column
    auction_end:Date;

    @ForeignKey(()=>User)
    @IsUUID(4)
    @Column(DataType.UUID)
    userId!:string;

    @BelongsTo(()=>User, 'userId')
    user:User;

    @ForeignKey(()=>Subsection)
    @Column
    subsectionId!:number;

    @BelongsTo(()=>Subsection, 'subsectionId')
    subsection:Subsection;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

};