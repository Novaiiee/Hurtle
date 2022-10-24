import { IsString, MinLength } from "class-validator";

export class CreateFlashCardDto {
	@MinLength(2, { message: "Question: Must be 3 characters long" })
	question: string;

	@MinLength(2, { message: "Question: Must be 3 characters long" })
	answer: string;

	@IsString({ message: "SetId: Must be a string" })
	setId: string;
}
