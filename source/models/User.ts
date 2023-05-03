import { Table, Column, Model, HasMany, IsUUID, CreatedAt, DeletedAt, PrimaryKey, Default, UpdatedAt, Unique, DataType, Validate } from 'sequelize-typescript';
import { UserLog } from './UserLog';
import { Listing } from './Listing';
import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup';
import { AuthToken } from './AuthToken';
import { Bid } from './Bid';

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

	@Unique
	@Column
    username!: string;

	@Validate({
		is: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
	})
	@Unique
	@Column
    email!: string;

	@Column
    password!: string;

	@Column
    access!: string;

	@Default(0)
	@Column
    reputation!: number;

	// associations
	@HasMany(() => UserLog, 'userId')
    logs: UserLog[] | undefined;

	@HasMany(() => Listing, 'userId')
    listings: Listing[] | undefined;

	@HasMany(() => AuthToken, 'userId')
    authTokens: AuthToken[] | undefined;

	@HasMany(() => Bid, 'userId')
    bids: Bid[] | undefined;

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
