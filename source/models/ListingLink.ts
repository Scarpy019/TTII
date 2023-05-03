import { type Optional } from 'sequelize';
import { UUID } from '../sequelizeSetup';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Media } from './Media';
import { Listing } from './Listing';

interface ListingLinkAttributes {
	listingId: UUID;
	image_number: number;
	mediaUUID: UUID;
};

export type ListingLinkInput = Optional<ListingLinkAttributes, never>;
export type ListingLinkOutput = Required<ListingLinkAttributes>;

@Table({
	tableName: 'listingLinks'
})
export class ListingLink extends Model<ListingLinkAttributes, ListingLinkInput> {
	@PrimaryKey
	@ForeignKey(() => Listing)
	@Column(DataType.UUID)
    listingId: UUID;

	@PrimaryKey
	@Column
    image_number: number;

	@BelongsTo(() => Listing, 'listingId')
    listing: Listing | undefined;

	@AllowNull(false)
	@ForeignKey(() => Media)
	@Column(DataType.UUID)
    mediaUUID: UUID;

	@BelongsTo(() => Media, 'mediaUUID')
    media: Media | undefined;

	@CreatedAt
	@Column
	readonly createdAt!: Date;
};
