import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateFlashCardDto {
	@ApiProperty()
	@MinLength(2, { message: "Question: Must be 3 characters long" })
	question: string;

	@ApiProperty()
	@MinLength(2, { message: "Question: Must be 3 characters long" })
	answer: string;

	@ApiProperty()
	@IsString({ message: "SetId: Must be a string" })
	setId: string;
}
