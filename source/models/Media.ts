import { type Optional } from 'sequelize';
import { type UUID } from '../sequelizeSetup';
import { AllowNull, Column, CreatedAt, DataType, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ListingLink } from './ListingLink';

interface MediaAttributes {
	/** UUID must be the same as the saved file name */
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
	@Column(DataType.UUID)
    uuid: string;

	@AllowNull(false)
	@Column
    extension: string;

	@HasOne(() => ListingLink, 'mediaUUID')
    listingLink: ListingLink | null | undefined;

	@CreatedAt
	@Column
	readonly createdAt!: Date;
};
