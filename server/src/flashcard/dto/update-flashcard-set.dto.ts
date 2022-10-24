import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFlashCardSetDto {
	@ApiProperty()
	setId: string;

	@ApiPropertyOptional()
	title: string;

	@ApiPropertyOptional()
	description: string;

	@ApiPropertyOptional()
	isPublic: boolean;
}
