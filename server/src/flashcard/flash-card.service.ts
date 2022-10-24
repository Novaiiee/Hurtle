import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@users/entities/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
import { CreateFlashCardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashCardSetDto } from "./dto/update-flashcard-set.dto";
import { UpdateFlashCardDto } from "./dto/update-flashcard.dto";
import { FlashCardSetEntity } from "./entities/flash-card-set.entity";
import { FlashCardEntity } from "./entities/flash-card.entity";

@Injectable()
export class FlashCardService {
	constructor(
		@InjectRepository(FlashCardEntity) private readonly cardRepository: Repository<FlashCardEntity>,
		@InjectRepository(FlashCardSetEntity) private readonly setRepository: Repository<FlashCardSetEntity>,
		private readonly userService: UsersService
	) {}

	async getMySets(user: UserEntity) {
		const [sets, count] = await this.setRepository.findAndCount({
			where: { creator: { id: user.id } },
			relations: ["cards"]
		});

		return {
			count,
			sets
		};
	}

	async getSetById(user: UserEntity, id: string) {
		return this.setRepository.findOne({ where: { id, creator: { id: user.id } }, relations: ["cards"] });
	}

	async createFlashCardSet(user: UserEntity, body: CreateFlashCardSetDto) {
		let set = await this.setRepository.create({
			creator: user,
			description: body.description,
			title: body.title,
			isPublic: body.isPublic,
			cards: []
		});

		set = await this.setRepository.save(set);

		const cards = await Promise.all(
			body.flashCards.map(async (c) => {
				const card = this.cardRepository.create({
					answer: c.answer,
					question: c.question,
					parentSet: set
				});

				return await this.cardRepository.save(card);
			})
		);

		set.cards = cards;
		set = await this.setRepository.save(set);

		await this.userService.addUserSet(user, set);
		return set;
	}

	async createFlashCard(creator: UserEntity, cardData: CreateFlashCardDto) {
		const set = await this.setRepository.findOne({
			where: { id: cardData.setId, creator: { id: creator.id } },
			relations: ["cards"]
		});

		const newCard = this.cardRepository.create({
			...cardData,
			parentSet: set
		});

		set.cards = [...set.cards, newCard];

		await this.cardRepository.save(newCard);
		await this.setRepository.save(set);
	}

	async deleteFlashCard(setId: string, id: string) {
		const card = await this.cardRepository.findOne({ where: { id, parentSet: { id: setId } } });
		await this.cardRepository.remove(card);
	}

	async deleteFlashCardSet(creator: UserEntity, id: string) {
		const set = await this.setRepository.findOne({ where: { id, creator: { id: creator.id } }, relations: ["cards"] });

		await this.cardRepository.remove(set.cards);
		await this.setRepository.remove(set);
	}

	async updateFlashCard(updatedData: UpdateFlashCardDto) {
		const card = await this.cardRepository.findOne({
			where: { id: updatedData.id, parentSet: { id: updatedData.setId } }
		});

		card.answer = updatedData.answer || card.answer;
		card.question = updatedData.question || card.question;

		await this.cardRepository.save(card);
	}

	async updateFlashCardSet(creator: UserEntity, updatedData: UpdateFlashCardSetDto) {
		const set = await this.setRepository.findOne({ where: { id: updatedData.setId, creator: { id: creator.id } } });

		set.title = updatedData.title || set.title;
		set.description = updatedData.description || set.description;
		set.isPublic = updatedData.isPublic || set.isPublic;

		await this.setRepository.save(set);
	}
}
