import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './User';

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
	authToken: string;

	@ForeignKey(() => User)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId: UUID;

	@BelongsTo(() => User, 'userId')
	user: User | undefined;

	@CreatedAt
	@Column
	readonly createdAt!: Date;
};
