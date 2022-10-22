import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserEntity } from "../../users/entities/user.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: "identifier"
		});
	}

	async validate(identifier: string, password: string): Promise<UserEntity> {
		return this.authService.validateUser(identifier, password);
	}
}
