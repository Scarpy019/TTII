import { Table, Column, Model, HasMany, IsUUID, CreatedAt, DeletedAt, PrimaryKey, Default, UpdatedAt, Unique, DataType, Validate, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserLog } from './UserLog.js';
import { Listing } from './Listing.js';
import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup.js';
import { Bid } from './Bid.js';
import { UserAccess } from './UserAccess.js';

/**
 * Helper interface for Users
 */
interface UserAttributes {
	id: UUID;
	username: string;
	email: string;
	password: string;
	access: string;
	reputation: number;
	draftListingId: UUID | null;
};
type UserInput = Optional<UserAttributes, 'reputation'>;
export type UserOutput = Required<UserAttributes>;

@Table({
	tableName: 'users',
	timestamps: true,
	paranoid: true
})
export class User extends Model<UserAttributes, UserInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
    id!: UUID;

	@Unique('username')
	@Column
    username!: string;

	@Validate({
		is: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
	})
	@Unique('email')
	@Column
    email!: string;

	@Column
    password!: string;

	@ForeignKey(() => UserAccess)
	@Column
	access!: string;

	@Default(false)
	@Column
	banned!: boolean;

	@BelongsTo(() => UserAccess, 'access')
	accesslevel!: ReturnType<() => UserAccess>;

	@Default(0)
	@Column
    reputation!: number;

	@Default(null)
	@ForeignKey(() => Listing)
	@Column(DataType.UUID)
	draftListingId!: string | null;

	// associations
	@HasMany(() => UserLog, 'userId')
    logs?: UserLog[];

	@HasMany(() => Listing, 'userId')
    listings?: Listing[];

	@HasMany(() => Bid, 'userId')
    bids?: Bid[];

	@BelongsTo(() => Listing, 'draftListingId')
	draftListing?: ReturnType<() => Listing>;

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
