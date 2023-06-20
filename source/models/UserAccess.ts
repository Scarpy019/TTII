import { Table, Column, Model, CreatedAt, DeletedAt, PrimaryKey, UpdatedAt, HasMany } from 'sequelize-typescript';
import { User } from './User.js';

interface UserAccessAttributes {
	access: string;
	client_access: boolean;
	hide_posts: boolean;
	timeout_user: boolean;
	category_admin: boolean;
	ban_user: boolean;
};

export type UserAccessOutput = Required<UserAccessAttributes>;

@Table({
	tableName: 'UserAccess',
	timestamps: true,
	paranoid: true
})
export class UserAccess extends Model<UserAccessAttributes, UserAccessOutput> {
	@PrimaryKey
	@Column
    access!: string;

	@Column
    client_access!: boolean;

	@Column
    hide_posts!: boolean;

	@Column
    timeout_user!: boolean;

	@Column
    category_admin!: boolean;

	@Column
    ban_user!: boolean;

	@HasMany(() => User, 'access')
	User?: ReturnType<() => User>;

	// timestamps
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
