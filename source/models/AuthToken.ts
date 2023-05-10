import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup.js';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './User.js';
import { authorization as config } from '../config.js';

export interface AuthTokenAttributes {
	authToken: string;
	userId: UUID;
};

export type AuthTokenInput = Optional<AuthTokenAttributes, never>;
export type AuthTokenOutput = Required<AuthTokenAttributes>;

@Table({
	tableName: 'authTokens'
})
export class AuthToken extends Model<AuthTokenAttributes, AuthTokenInput> {
	@PrimaryKey
	@Column(DataType.CHAR(64))
	authToken!: string;

	@ForeignKey(() => User)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: UUID;

	@BelongsTo(() => User, 'userId')
	user?: ReturnType<() => User>;

	@CreatedAt
	@Column
	readonly createdAt!: Date;

	@Default(new Date(Date.now() + config.tokenAgeDatabase * 24 * 60 * 60 * 1000))
	@Column
	maxLife!: Date;

	@CreatedAt
	@Column
	lastSeen!: Date;

	@Default(config.tokenLifeDatabase)
	@Column
	lifetime!: number;
};
