import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@users/entities/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
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
		const recentUserData = await this.userService.findOne(user.id);
		return {
			count: recentUserData.sets.length,
			sets: recentUserData.sets
		};
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
}
