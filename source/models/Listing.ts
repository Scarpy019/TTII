import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo, IsUUID, DataType, AllowNull } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { User } from './User';
import { Optional } from 'sequelize';
import { AutoId, UUID } from '../sequelizeSetup';
import { Bid } from './Bid';

/**
 * Helper interface for creating new Listings
 */
interface ListingAttributes{
    id:UUID;
    title:string;
    body:string;
    status:string;
    start_price:number;
    is_auction:boolean;
    auction_end:Date;
    userId:UUID;
    subsectionId:AutoId;
};
export interface ListingInput extends Optional<ListingAttributes, 
    'is_auction'|'auction_end'> {};
export interface ListingOuput extends Required<ListingAttributes> {};

@Table({
    tableName:'listings',
    timestamps:true,
    paranoid:true
})
export class Listing extends Model<ListingAttributes, ListingInput> {
    
    @PrimaryKey
    @IsUUID(4)
    @Column(DataType.UUID)
    id!:UUID;

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
    userId!:UUID;

    @ForeignKey(()=>Subsection)
    @AllowNull(false)
    @Column
    subsectionId!:AutoId;

    //relations
    @BelongsTo(()=>User, 'userId')
    user:User|undefined;

    @BelongsTo(()=>Subsection, 'subsectionId')
    subsection:Subsection|undefined;

    @HasMany(()=>Bid, 'listingId')
    bids:Bid[]|undefined;

    //timestamps
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