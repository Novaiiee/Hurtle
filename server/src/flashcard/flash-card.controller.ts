import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserEntity } from "@users/entities/user.entity";
import { Request } from "express";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
import { FlashCardService } from "./flash-card.service";

@Controller("cards")
@UseGuards(AuthGuard("jwt"))
export class FlashCardController {
	constructor(private readonly cardService: FlashCardService) {}

	@Get()
	async getMySets(@Req() { user }: Request) {
		return this.cardService.getMySets(user as UserEntity);
	}

	@Post("/set")
	async createFlashCardSet(@Req() { user }: Request, @Body() body: CreateFlashCardSetDto) {
		return await this.cardService.createFlashCardSet(user as UserEntity, body);
	}
}
