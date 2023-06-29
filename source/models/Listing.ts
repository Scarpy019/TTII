import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Default, UpdatedAt, ForeignKey, BelongsTo, IsUUID, DataType, AllowNull, HasOne } from 'sequelize-typescript';
import { Subsection } from './Subsection.js';
import { User } from './User.js';
import { type Optional } from 'sequelize';
import { AutoId, UUID } from '../sequelizeSetup.js';
import { Bid } from './Bid.js';
import { Media } from './Media.js';

/**
 * Helper interface for creating new Listings
 */
export interface ListingAttributes {
	id: UUID;
	title: string;
	body: string;
	status: string;
	start_price: number;
	is_auction: boolean;
	auction_end: Date;
	userId: UUID;
	subsectionId: AutoId;
	is_draft: boolean;
};
export type ListingInput = Optional<ListingAttributes, 'is_auction' | 'auction_end'>;
export type ListingOuput = Required<ListingAttributes>;

@Table({
	tableName: 'listings',
	timestamps: true,
	paranoid: true
})
export class Listing extends Model<ListingAttributes, ListingInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
    id!: UUID;

	@Column
    title!: string;

	@Column
    body!: string;

	@Column
    status?: string;

	@Column
    start_price?: number;

	@Default(false)
	@Column
    is_auction?: boolean;

	@Default(null)
	@Column
    auction_end?: Date;

	@ForeignKey(() => User)
	@IsUUID(4)
	@AllowNull(false)
	@Column(DataType.UUID)
    userId!: UUID;

	@ForeignKey(() => Subsection)
	@AllowNull(false)
	@Column
    subsectionId!: AutoId;

	@AllowNull(false)
	@Column
	is_draft!: boolean;

	// relations
	@BelongsTo(() => User, 'userId')
    user?: ReturnType<() => User>;

	@BelongsTo(() => Subsection, 'subsectionId')
    subsection?: ReturnType<() => Subsection>;

	@HasMany(() => Bid, 'listingId')
    bids?: Bid[];

	@HasMany(() => Media, 'listingId')
	media?: Media[];

	@HasOne(() => User, 'draftListingId')
	draftOwner?: ReturnType<() => User>;

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
