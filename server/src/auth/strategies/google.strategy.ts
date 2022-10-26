import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
		super({
			clientID: configService.get("GOOGLE_CLIENT_ID"),
			clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
			callbackURL: configService.get("GOOGLE_REDIRECT_URL"),
			scope: ["email", "profile"]
		});
	}

	async validate(_, __, profile: Profile): Promise<any> {
		return this.authService.loginWithOAuth(profile);
	}
}
