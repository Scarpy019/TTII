import { Table, Column, Model, CreatedAt, PrimaryKey, UpdatedAt, IsUUID, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './User.js';
import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup.js';

interface ChatMessageAttributes {
	id: UUID;
	senderId: string | null;
	receiverId: string | null;
};

type ChatMessageInput = Optional<ChatMessageAttributes, 'id'>;
export type ChatMessageOutput = Required<ChatMessageAttributes>;

@Table({
	tableName: 'chatMessages',
	timestamps: true
})
export class ChatMessage extends Model<ChatMessageAttributes, ChatMessageInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
	declare id: UUID;

	@ForeignKey(() => User)
	@IsUUID(4)
	@Column(DataType.UUID)
	declare senderId: string | null;

	@ForeignKey(() => User)
	@IsUUID(4)
	@Column(DataType.UUID)
	declare receiverId: string | null;

	@CreatedAt
	@Column
	readonly createdAt!: Date;

	@UpdatedAt
	@Column
	readonly updatedAt!: Date;
};
