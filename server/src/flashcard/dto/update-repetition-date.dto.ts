import { ApiProperty } from "@nestjs/swagger";

export class UpdateRepetitionDateDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	setId: string;

	@ApiProperty()
	days: number;

	@ApiProperty()
	lastPracticed: string;
}
