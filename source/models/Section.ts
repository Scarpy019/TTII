import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, UpdatedAt, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { type Optional } from 'sequelize';
import { AutoId } from '../sequelizeSetup';

export interface SectionAttributes {
	id: AutoId;
	name: string;
	subsections: Subsection[];
};
type SectionInput = Optional<SectionAttributes, 'id' | 'subsections'>;
export type SectionOutput = Required<SectionAttributes>;

@Table({
	tableName: 'sections',
	timestamps: true,
	paranoid: true
})
export class Section extends Model<SectionAttributes, SectionInput> {
	@PrimaryKey
	@AutoIncrement
	@Column
    id!: AutoId;

	@AllowNull(false)
	@Column
    name!: string;

	@HasMany(() => Subsection, 'sectionId')
    subsections?: Subsection[];

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
