import { type Optional } from 'sequelize';
import { type UUID } from '../sequelizeSetup.js';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Listing } from './Listing.js';

interface MediaAttributes {
	/** UUID must be the same as the saved file name */
	uuid: UUID;
	extension: string;
	listingId: UUID;
};

export type MediaInput = Optional<MediaAttributes, never>;
export type MediaOutput = Required<MediaAttributes>;

@Table({
	tableName: 'media'
})
export class Media extends Model<MediaAttributes, MediaInput> {
	@PrimaryKey
	@IsUUID(4)
	@Column(DataType.UUID)
    uuid!: string;

	@AllowNull(false)
	@Column
    extension!: string;

	@AllowNull(false)
	@ForeignKey(() => Listing)
	@Column(DataType.UUID)
	listingId!: UUID;

	@BelongsTo(() => Listing, 'listingId')
	listings?: ReturnType<() => Listing>;

	@CreatedAt
	@Column
	readonly createdAt!: Date;
};
