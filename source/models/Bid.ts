import { Optional } from "sequelize";
import { AutoId, UUID } from "../sequelizeSetup";
import { AllowNull, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./User";
import { Listing } from "./Listing";


interface BidAttributes{
    userId:UUID;
    listingId:UUID;
    bid_amount:number;
};
export interface BidInput extends Optional<BidAttributes, never> {};
export interface BidOuput extends Required<BidAttributes> {};

@Table({
    tableName:'bids'
})
export class Bid extends Model<BidAttributes, BidInput>{
    
    @PrimaryKey
    @ForeignKey(()=>User)
    @Column(DataType.UUID)
    userId:UUID;

    @PrimaryKey
    @ForeignKey(()=>Listing)
    @Column(DataType.UUID)
    listingId:UUID;

    @AllowNull(false)
    @Column
    bid_amount:number;

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
