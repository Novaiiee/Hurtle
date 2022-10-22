import { UserEntity } from "../users/entities/user.entity";

export interface LoginResult {
	user: Omit<UserEntity, "password" | "accounts" | "provider">;
	token: string;
}

export interface ProfileExtraction {
	email: string;
	username: string;
	provider: Provider;
}

export type Provider = "github" | "google" | "local";
