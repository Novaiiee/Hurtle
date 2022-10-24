import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { CreateFlashCardDto } from "./create-flashcard.dto";

export class CreateFlashCardSetDto {
	@ApiProperty()
	@MinLength(3, { message: "Title: Must be 4 characters long" })
	title: string;

	@IsString({ message: "Description: Must be a string" })
	@MaxLength(500, { message: "Description: Must be shorter than 500 characters" })
	@ValidateIf((_, value) => value !== null)
	@ApiPropertyOptional()
	description: string;

	@ApiProperty({ type: [CreateFlashCardDto] })
	@IsArray({ message: "Flashcards: Must be an array of items" })
	flashCards: CreateFlashCardDto[];

	@ApiProperty()
	@IsBoolean({ message: "IsPublic: Must be a booleaen" })
	isPublic: boolean;
}
