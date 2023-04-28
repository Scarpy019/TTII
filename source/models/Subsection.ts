import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './Section';
import { Listing } from './Listing';
import { Optional } from 'sequelize';

export interface SubsectionModel extends Optional<any,string>{
    id:number;
    name:string;
};

@Table({
    tableName:'subsections'
})
export class Subsection extends Model {
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
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

};