import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { CreateFlashCardSetDto } from "./dto/create-flashcard-set.dto";
import { CreateFlashCardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashCardSetDto } from "./dto/update-flashcard-set.dto";
import { UpdateFlashCardDto } from "./dto/update-flashcard.dto";
import { UpdateRepetitionDateDto } from "./dto/update-repetition-date.dto";
import { FlashCardService } from "./flash-card.service";

@Controller("cards")
@UseGuards(AuthGuard("jwt"))
export class FlashCardController {
	constructor(private readonly cardService: FlashCardService) {}

	@Get()
	@ApiTags("Flashcard Sets")
	async getMySets(@Req() { user }) {
		return this.cardService.getMySets(user.id);
	}

	@Get("/:id")
	@ApiTags("Flashcard Sets")
	async getSetById(@Req() { user }, @Param("id") id: string) {
		return this.cardService.getSetById(user.id, id);
	}

	@Post("/set")
	@ApiTags("Flashcard Sets")
	async createFlashCardSet(@Req() { user }, @Body() body: CreateFlashCardSetDto) {
		return await this.cardService.createFlashCardSet(user, body);
	}

	@Post()
	@ApiTags("Flashcards")
	async createFlashCard(@Req() { user }, @Body() cardData: CreateFlashCardDto) {
		await this.cardService.createFlashCard(user.id, cardData);
	}

	@Delete("/set/:id")
	@ApiTags("Flashcard Sets")
	async deleteFlashCardSet(@Req() { user }, @Param("id") id: string) {
		await this.cardService.deleteFlashCardSet(user.id, id);
	}

	@Delete()
	@ApiTags("Flashcards")
	async deleteFlashCard(@Query("id") id: string, @Query("setId") setId: string) {
		await this.cardService.deleteFlashCard(setId, id);
	}

	@Patch()
	@ApiTags("Flashcards")
	async updateFlashCard(@Body() data: UpdateFlashCardDto) {
		await this.cardService.updateFlashCard(data);
	}

	@Patch("/set")
	@ApiTags("Flashcard Sets")
	async updateFlashCardSet(@Req() { user }, @Body() data: UpdateFlashCardSetDto) {
		await this.cardService.updateFlashCardSet(user.id, data);
	}

	@Patch("/repetition")
	@ApiTags("Flashcards")
	async updateRepetitionDate(@Body() data: UpdateRepetitionDateDto) {
		await this.cardService.updateRepetitionDate(data);
	}
}
