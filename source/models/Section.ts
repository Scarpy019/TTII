import { Table, Column, Model, HasMany, CreatedAt, DeletedAt, PrimaryKey, Is, Default, UpdatedAt, AutoIncrement } from 'sequelize-typescript';
import { Subsection } from './Subsection';
import { Optional } from 'sequelize';

export interface SectionModel extends Optional<any,string>{
    id:number;
    name:string;
};

@Table({
    tableName:'sections'
})
export class Section extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!:number;

    @Column
    name!: string;

    @HasMany(()=>Subsection, 'sectionId')
    subsections:Subsection[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

};