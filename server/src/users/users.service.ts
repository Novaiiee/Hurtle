import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlashCardSetEntity } from "../flashcard/entities/flash-card-set.entity";
import { AccountEntity } from "./entities/account.entity";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
		@InjectRepository(AccountEntity) private readonly accountsRepository: Repository<AccountEntity>
	) {}

	async findOne(id: string) {
		return this.usersRepository.findOne({
			where: {
				id
			},
			relations: ["accounts", "sets"]
		});
	}

	async findByIdentifier(identifier: string) {
		const user = await this.usersRepository.findOne({ where: { email: identifier }, relations: ["accounts"] });
		if (user) return user;

		return this.usersRepository.findOne({ where: { username: identifier }, relations: ["accounts"] });
	}

	async create(data: Omit<Partial<UserEntity>, "createdAt" | "updatedAt">) {
		const user = this.usersRepository.create({ ...data });
		return this.usersRepository.save(user);
	}

	async createAccount(details: Omit<Partial<AccountEntity>, "createdAt" | "updatedAt">) {
		const account = this.accountsRepository.create({ ...details });
		await this.accountsRepository.save(account);

		return account;
	}

	async addAccount(account: AccountEntity, userId: string) {
		const user = await this.findOne(userId);
		user.accounts = [...user.accounts, account];

		return this.usersRepository.save(user);
	}

	async addUserSet(user: UserEntity, set: FlashCardSetEntity) {
		user.sets = [set, ...user.sets];
		return this.usersRepository.save(user);
	}
}
