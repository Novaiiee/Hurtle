import { Provider } from "@auth/types";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "account" })
export class AccountEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	email: string;

	@Column({ nullable: true, default: null })
	@Exclude()
	password?: string;

	@Column()
	provider: Provider;

	@ManyToOne(() => UserEntity, (user) => user.accounts)
	user: UserEntity;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
