import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFlashCardDto {
	@ApiProperty()
	setId: string;

	@ApiProperty()
	id: string;

	@ApiPropertyOptional()
	answer: string;

	@ApiPropertyOptional()
	question: string;
}
