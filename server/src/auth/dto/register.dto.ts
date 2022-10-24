import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class RegisterDTO {
	@ApiProperty()
	@MinLength(3, { message: "Username: Must be 4 characters long" })
	username: string;

	@ApiProperty()
	@MinLength(5, { message: "Password: Must be 6 characters long" })
	password: string;

	@ApiProperty()
	@IsEmail({}, { message: "Email: Must be an Email" })
	email: string;
}
