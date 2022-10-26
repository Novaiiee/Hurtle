import { UserEntity } from "@users/entities/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { FlashCardEntity } from "./flash-card.entity";

@Entity({ name: "flashcard_sets" })
export class FlashCardSetEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	description?: string;

	@OneToMany(() => FlashCardEntity, (card) => card.parentSet)
	cards: FlashCardEntity[];

	@ManyToOne(() => UserEntity, (user) => user.id)
	creator: UserEntity;

	@Column({ type: "boolean" })
	isPublic: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
