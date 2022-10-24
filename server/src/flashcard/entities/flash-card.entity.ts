import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FlashCardSetEntity } from "./flash-card-set.entity";

@Entity({ name: "flashcards" })
export class FlashCardEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	question: string;

	@Column()
	answer: string;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	lastPracticedDate: Date;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	nextPracticedDate: Date;

	@ManyToOne(() => FlashCardSetEntity, (p) => p.cards)
	parentSet: FlashCardSetEntity;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
