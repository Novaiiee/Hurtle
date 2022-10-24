import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FlashCardSetEntity } from "../../flashcard/entities/flash-card-set.entity";
import { AccountEntity } from "./account.entity";

@Entity({ name: "users" })
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	email: string;

	@OneToMany(() => AccountEntity, (acc) => acc.user)
	accounts: AccountEntity[];

	@OneToMany(() => FlashCardSetEntity, (set) => set.creator)
	sets: FlashCardSetEntity[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
