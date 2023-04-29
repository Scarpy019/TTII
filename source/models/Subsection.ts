import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './Section';
import { Listing } from './Listing';
import { Optional } from 'sequelize';

export interface SubsectionAttributes{
    id:number;
    name:string;
    sectionId:number;
};
interface SubsectionInput extends Optional<SubsectionAttributes, 'id'>{};
export interface SubsectionOutput extends Required<SubsectionAttributes>{};


@Table({
    tableName:'subsections',
    timestamps:true,
    paranoid:true
})
export class Subsection extends Model<SubsectionAttributes, SubsectionInput> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!:number;

    @Column
    name!: string;

    @ForeignKey(()=>Section)
    @Column
    sectionId!:number;

    @BelongsTo(()=>Section, 'sectionId')
    section!:Section;

    @HasMany(()=>Listing, 'subsectionId')
    listings:Listing[];

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