import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@users/entities/user.entity";
import * as dayjs from "dayjs";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
import { CreateFlashCardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashCardSetDto } from "./dto/update-flashcard-set.dto";
import { UpdateFlashCardDto } from "./dto/update-flashcard.dto";
import { UpdateRepetitionDateDto } from "./dto/update-repetition-date.dto";
import { FlashCardSetEntity } from "./entities/flash-card-set.entity";
import { FlashCardEntity } from "./entities/flash-card.entity";

@Injectable()
export class FlashCardService {
	constructor(
		@InjectRepository(FlashCardEntity) private readonly cardRepository: Repository<FlashCardEntity>,
		@InjectRepository(FlashCardSetEntity) private readonly setRepository: Repository<FlashCardSetEntity>,
		private readonly userService: UsersService
	) {}

	async getMySets(userId: string) {
		try {
			const [sets, count] = await this.setRepository.findAndCount({
				where: { creator: { id: userId } },
				relations: ["cards"]
			});

			return {
				count,
				sets
			};
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async getSetById(userId: string, id: string) {
		return this.setRepository.findOne({ where: { id, creator: { id: userId } }, relations: ["cards"] });
	}

	async createFlashCardSet(user: UserEntity, body: CreateFlashCardSetDto) {
		try {
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
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async createFlashCard(userId: string, cardData: CreateFlashCardDto) {
		try {
			const set = await this.setRepository.findOne({
				where: { id: cardData.setId, creator: { id: userId } },
				relations: ["cards"]
			});

			const newCard = this.cardRepository.create({
				...cardData,
				parentSet: set
			});

			set.cards = [...set.cards, newCard];

			await this.cardRepository.save(newCard);
			await this.setRepository.save(set);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async deleteFlashCard(setId: string, id: string) {
		try {
			const card = await this.cardRepository.findOne({ where: { id, parentSet: { id: setId } } });
			await this.cardRepository.remove(card);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async deleteFlashCardSet(userId: string, id: string) {
		try {
			const set = await this.setRepository.findOne({
				where: { id, creator: { id: userId } },
				relations: ["cards"]
			});

			await this.cardRepository.remove(set.cards);
			await this.setRepository.remove(set);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async updateFlashCard(updatedData: UpdateFlashCardDto) {
		try {
			const card = await this.cardRepository.findOne({
				where: { id: updatedData.id, parentSet: { id: updatedData.setId } }
			});

			card.answer = updatedData.answer || card.answer;
			card.question = updatedData.question || card.question;

			await this.cardRepository.save(card);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async updateFlashCardSet(userId: string, updatedData: UpdateFlashCardSetDto) {
		try {
			const set = await this.setRepository.findOne({
				where: {
					id: updatedData.setId,
					creator: { id: userId }
				}
			});

			set.title = updatedData.title || set.title;
			set.description = updatedData.description || set.description;
			set.isPublic = updatedData.isPublic || set.isPublic;

			await this.setRepository.save(set);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}

	async updateRepetitionDate(data: UpdateRepetitionDateDto) {
		try {
			const card = await this.cardRepository.findOne({
				where: { id: data.id, parentSet: { id: data.setId } }
			});

			const date = new Date(data.lastPracticed);
			const nextDate = dayjs(date).add(data.days, "days").toDate();

			card.lastPracticedDate = date;
			card.nextPracticedDate = nextDate;

			await this.cardRepository.save(card);
		} catch (error) {
			throw new HttpException(error.message, 500);
		}
	}
}
