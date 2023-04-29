import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo, IsUUID, DataType, AllowNull } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { User } from './User';
import { Optional } from 'sequelize';

/**
 * Helper interface for creating new Listings
 */
interface ListingAttributes{
    id:number;
    title:string;
    body:string;
    status:string;
    start_price:number;
    is_auction:boolean;
    auction_end:Date;
    userId:string;
    subsectionId:number;
};
export interface ListingInput extends Optional<ListingAttributes, 
    'id' | 'is_auction'|'auction_end'> {};
export interface ListingOuput extends Required<ListingAttributes> {};

@Table({
    tableName:'listings',
    timestamps:true,
    paranoid:true
})
export class Listing extends Model<ListingAttributes, ListingInput> {
    @AutoIncrement
    @PrimaryKey
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

    @Default(false)
    @Column
    is_auction:boolean;

    @Default(null)
    @Column
    auction_end:Date;

    @ForeignKey(()=>User)
    @IsUUID(4)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId!:string;

    @BelongsTo(()=>User, 'userId')
    user:User;

    @ForeignKey(()=>Subsection)
    @AllowNull(false)
    @Column
    subsectionId!:number;

    @BelongsTo(()=>Subsection, 'subsectionId')
    subsection:Subsection;

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