import { Table, Column, Model, CreatedAt, PrimaryKey, UpdatedAt, IsUUID, DataType, ForeignKey } from 'sequelize-typescript';
import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup.js';
import { ChatMessage } from './ChatMessage.js';

interface MessageComponentAttributes {
	id: UUID;
	messageId: UUID;
	/*
	The stage in a sepcific message transfer
	- ANNOUNCE: Announcing that a new message will be sent, the content contains common factors p and q, format: P|Q
	- KEY: Sent by both users, this is a part of the shared key, content format: USERID|KEYPART
	- MESSAGE: The encrypted message
	*/
	stage: 'ANNOUNCE' | 'KEY' | 'MESSAGE';
	content: string;
};

type MessageComponentInput = Optional<MessageComponentAttributes, 'id'>;
export type MessageComponentOutput = Required<MessageComponentAttributes>;

@Table({
	tableName: 'messageComponents',
	timestamps: true
})
export class MessageComponent extends Model<MessageComponentAttributes, MessageComponentInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
	declare id: UUID;

	@ForeignKey(() => ChatMessage)
	@IsUUID(4)
	@Column(DataType.UUID)
	declare messageId: string | null;

	@Column
	declare stage: 'ANNOUNCE' | 'KEY' | 'MESSAGE';

	@Column
	declare content: string;

	@CreatedAt
	@Column
	readonly createdAt!: Date;

	@UpdatedAt
	@Column
	readonly updatedAt!: Date;
};
