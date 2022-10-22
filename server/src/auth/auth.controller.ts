import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { UserEntity } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginResult } from "./types";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AuthGuard("local"))
	@Post("/login")
	async login(@Req() req: Request): Promise<LoginResult> {
		return this.authService.login(req.user as UserEntity);
	}

	@Post("/register")
	async register(@Body() data: RegisterDTO): Promise<LoginResult> {
		return this.authService.register(data);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("/profile")
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Get("/google")
	@UseGuards(AuthGuard("google"))
	async googleAuth() { }

	@Get("/google/callback")
	@UseGuards(AuthGuard("google"))
	googleAuthCallback(@Req() req: Request, @Res() res: Response) {
		const { token } = req.user as {
			token: string;
			user: UserEntity;
		};

		res.cookie("session", token, {
			domain: process.env.CLIENT_DOMAIN,
			path: "/",
			sameSite: false
		});

		res.redirect(process.env.CLIENT_AUTH_REDIRECT + `?token=${token}`);
	}
}
