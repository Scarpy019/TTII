import { Table, Column, Model, CreatedAt, DeletedAt, PrimaryKey, BelongsTo, UpdatedAt, IsUUID, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './User';
import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup';

export interface Log {
	// TODO: keys for db logs
	action?: 'GET' | 'PUT' | 'DELETE' | 'POST';
};

interface UserLogAttributes {
	id: UUID;
	log: Log;
	userId: string;
};

type UserLogInput = Optional<UserLogAttributes, 'id'>;
export type UserLogOutput = Required<UserLogAttributes>;

@Table({
	tableName: 'userLogs',
	timestamps: true,
	paranoid: true
})
export class UserLog extends Model<UserLogAttributes, UserLogInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
	declare id: UUID;

	@Column(DataType.JSON)
	declare log: Log;

	@ForeignKey(() => User)
	@IsUUID(4)
	@Column(DataType.UUID)
	declare userId: string;

	@BelongsTo(() => User, 'userId')
	declare user: User | undefined;

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
