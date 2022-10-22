import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "./entities/account.entity";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity])],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}
