import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { UserEntity } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginResult, ProfileExtraction } from "./types";

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

	async validateUser(identifier: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByIdentifier(identifier);
		if (!user) throw new UnauthorizedException("User not found");

		const account = user.accounts.find((x) => x.provider === "local");

		if (!account) {
			throw new BadRequestException(`Sign in with a different provider`);
		}

		const isPasswordValid = await compare(password, account.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Password is Invalid");
		}

		return user;
	}

	generateToken(id: string, username: string) {
		return this.jwtService.sign({ id, username });
	}

	async login(user: UserEntity): Promise<LoginResult> {
		const token = this.generateToken(user.id, user.username);
		const { createdAt, email, id, updatedAt, username } = user;

		return {
			token,
			user: {
				createdAt,
				email,
				id,
				updatedAt,
				username,
				sets: []
			}
		};
	}

	async register(data: RegisterDTO) {
		const finder = await this.findByIdentifier(data.email, data.username);

		if (finder.exists) {
			throw new UnauthorizedException("User already exists");
		}

		const user = await this.usersService.create({
			email: data.email,
			username: data.username,
			sets: [],
			accounts: [
				await this.usersService.createAccount({
					email: data.email,
					password: await hash(data.password, 12),
					provider: "local"
				})
			]
		});

		return this.login(user);
	}

	async registerWithOAuth(data: ProfileExtraction) {
		const user = await this.usersService.create({
			email: data.email,
			username: data.username,
			accounts: [await this.usersService.createAccount({ email: data.email, provider: data.provider })]
		});

		return this.login(user);
	}

	async findByIdentifier(email: string, username: string) {
		let doesUserExist = await this.usersService.findByIdentifier(email);

		if (doesUserExist)
			return {
				user: doesUserExist,
				exists: true
			};

		doesUserExist = await this.usersService.findByIdentifier(username);

		if (doesUserExist)
			return {
				user: doesUserExist,
				exists: true
			};

		return {
			exists: false,
			user: null
		};
	}

	async loginWithOAuth(profile: GoogleProfile): Promise<LoginResult> {
		const profileUser = this.extractUserFromProfile(profile);
		const finder = await this.findByIdentifier(profileUser.email, profileUser.username);

		if (!finder.exists) {
			return this.registerWithOAuth(profileUser);
		}

		const account = finder.user.accounts.find((x) => x.provider === profileUser.provider);
		const providerExists = ["google", "local"].find((x) => x === profileUser.provider);

		if (!account && providerExists) {
			finder.user = await this.usersService.addAccount(
				await this.usersService.createAccount({
					email: profileUser.email,
					provider: profileUser.provider
				}),
				finder.user.id
			);
		}

		const token = this.generateToken(finder.user.id, finder.user.username);

		return {
			user: finder.user,
			token
		};
	}

	extractUserFromProfile(profile: GoogleProfile): ProfileExtraction {
		return {
			email: profile.emails[0].value,
			username: `${profile.name.givenName} ${profile.name.familyName}`,
			provider: "google"
		};
	}
}
