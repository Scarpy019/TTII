# Making of models

Models are created in a set way to ensure proper type and property hinting

Here is the full code for the subsection model.

```ts
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
```

## SubsectionAttributes

```ts
export interface SubsectionAttributes{
    id:number;
    name:string;
    sectionId:number;
};
```

The attributes interface lists all accessible attributes from the model.

## SubsectionInput

```ts
interface SubsectionInput extends Optional<SubsectionAttributes, 'id'>{};
```

The input interface modifies the original attribute interface by setting listed attributes to optional.

In this case the attribute `id` is made optional.

## SubsectionOutput
```ts
export interface SubsectionOutput extends Required<SubsectionAttributes>{};
```

Just sets all attributes to mandatory, ensuring these attributes are defined (they still may be null)


## @Table
```ts
@Table({
    tableName:'subsections',
    timestamps:true,
    paranoid:true
})
```

Defines the table with modifiers

- tableName: overrides the default table name in the database, eliminating ambiguity around name pluralization

- timestamps: logs all creation and last update timestamps

- paranoid: if set, uses the deletedAt column. When deleted, the row isn't removed, only marked as deleted, with time of deletion marked.

## Model
```ts
export class Subsection extends Model<SubsectionAttributes, SubsectionInput> {
```

Declares the model with the attributes and input as the preffered constructor interface

## Decorators

### `@Column`
Describes that an attribute is an actual column in the table

**NOTE:** The `@Column` decorator must always be last

### `@PrimaryKey`
This column is a primary key

### `@ForeignKey(()=>Section)`
Describes that it is a foreign key referencing a row on the `Section` Model 

### `@BelongsTo`
```ts
@BelongsTo(()=>Section, 'sectionId')
section:Section;
```
Marks that this model belongs to a single `Section` via `sectionId` foreign key.
