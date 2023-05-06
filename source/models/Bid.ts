import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Listing } from './Listing';

export interface BidAttributes {
	userId: UUID;
	listingId: UUID;
	bid_amount: number;
};
export type BidInput = Optional<BidAttributes, never>;
export type BidOuput = Required<BidAttributes>;

@Table({
	tableName: 'bids'
})
export class Bid extends Model<BidAttributes, BidInput> {
	@PrimaryKey
	@ForeignKey(() => User)
	@Column(DataType.UUID)
	userId!: UUID;

	@PrimaryKey
	@ForeignKey(() => Listing)
	@Column(DataType.UUID)
	listingId!: UUID;

	@AllowNull(false)
	@Column
	bid_amount!: number;

	// associations
	@BelongsTo(() => User)
	user?: User;

	@BelongsTo(() => Listing)
	listing?: Listing;

	// timestamps
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
