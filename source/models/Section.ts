import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { Optional } from 'sequelize';
import { AutoId } from '../sequelizeSetup';

export interface SectionAttributes{
    id:AutoId;
    name:string;
    subsections:Subsection[];
};
interface SectionInput extends Optional<SectionAttributes,'id'|'subsections'>{};
export interface SectionOutput extends Required<SectionAttributes>{};
    

@Table({
    tableName:'sections',
    timestamps:true,
    paranoid:true
})
export class Section extends Model<SectionAttributes, SectionInput> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!:AutoId;

    @Column
    name!: string;

    @HasMany(()=>Subsection, 'sectionId')
    subsections:Subsection[];

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