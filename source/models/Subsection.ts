import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { Section } from './Section';
import { Listing } from './Listing';
import { type Optional } from 'sequelize';
import { AutoId } from '../sequelizeSetup';

export interface SubsectionAttributes {
	id: AutoId;
	name: string;
	sectionId: AutoId;
};
type SubsectionInput = Optional<SubsectionAttributes, 'id'>;
export type SubsectionOutput = Required<SubsectionAttributes>;

@Table({
	tableName: 'subsections',
	timestamps: true,
	paranoid: true
})
export class Subsection extends Model<SubsectionAttributes, SubsectionInput> {
	@PrimaryKey
	@AutoIncrement
	@Column
    id!: AutoId;

	@Column
    name!: string;

	@ForeignKey(() => Section)
	@AllowNull(false)
	@Column
    sectionId!: number;

	@BelongsTo(() => Section, 'sectionId')
    section?: Section;

	@HasMany(() => Listing, 'subsectionId')
    listings?: Listing[];

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
