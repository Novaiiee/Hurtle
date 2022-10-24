import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
import { CreateFlashCardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashCardSetDto } from "./dto/update-flashcard-set.dto";
import { UpdateFlashCardDto } from "./dto/update-flashcard.dto";
import { FlashCardService } from "./flash-card.service";

@Controller("cards")
@UseGuards(AuthGuard("jwt"))
export class FlashCardController {
	constructor(private readonly cardService: FlashCardService) {}

	@Get()
	async getMySets(@Req() { user }) {
		return this.cardService.getMySets(user);
	}

	@Get("/:id")
	async getSetById(@Req() { user }, @Param("id") id: string) {
		return this.cardService.getSetById(user, id);
	}

	@Post("/set")
	async createFlashCardSet(@Req() { user }, @Body() body: CreateFlashCardSetDto) {
		return await this.cardService.createFlashCardSet(user, body);
	}

	@Post()
	async createFlashCard(@Req() { user }, @Body() cardData: CreateFlashCardDto) {
		await this.cardService.createFlashCard(user, cardData);
	}

	@Delete("/set/:id")
	async deleteFlashCardSet(@Req() { user }, @Param("id") id: string) {
		await this.cardService.deleteFlashCardSet(user, id);
	}

	@Delete()
	async deleteFlashCard(@Query("id") id: string, @Query("setId") setId: string) {
		await this.cardService.deleteFlashCard(setId, id);
	}

	@Patch()
	async updateFlashCard(@Body() data: UpdateFlashCardDto) {
		await this.cardService.updateFlashCard(data);
	}

	@Patch("/set")
	async updateFlashCardSet(@Req() { user }, @Body() data: UpdateFlashCardSetDto) {
		await this.cardService.updateFlashCardSet(user, data);
	}
}
