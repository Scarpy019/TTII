import { type Optional } from 'sequelize';
import { type UUID } from '../sequelizeSetup.js';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table, Validate } from 'sequelize-typescript';
import { Listing } from './Listing.js';

interface MediaAttributes {
	/** UUID must be the same as the saved file name */
	listingId: UUID;
	orderNumber: number;
	uuid: UUID;
	extension: string;
};

export type MediaInput = Optional<MediaAttributes, never>;
export type MediaOutput = Required<MediaAttributes>;

@Table({
	tableName: 'media'
})
export class Media extends Model<MediaAttributes, MediaInput> {
	@PrimaryKey
	@ForeignKey(() => Listing)
	@Column(DataType.UUID)
	listingId!: UUID;

	@PrimaryKey
	@Validate({
		max: 6,
		min: 1
	})
	@Column
	orderNumber!: number;

	@AllowNull(false)
	@IsUUID(4)
	@Column(DataType.UUID)
    uuid!: string;

	@AllowNull(false)
	@Column
    extension!: string;

	@BelongsTo(() => Listing, 'listingId')
	listings?: ReturnType<() => Listing>;

	@CreatedAt
	@Column
	readonly createdAt!: Date;
};
