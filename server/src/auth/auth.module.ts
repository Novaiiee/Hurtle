import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			useFactory: (config: ConfigService) => ({
				secret: config.get("JWT_SECRET"),
				signOptions: { expiresIn: "7d" }
			}),
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}
