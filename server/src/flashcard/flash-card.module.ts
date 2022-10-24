import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { FlashCardSetEntity } from "./entities/flash-card-set.entity";
import { FlashCardEntity } from "./entities/flash-card.entity";
import { FlashCardController } from "./flash-card.controller";
import { FlashCardService } from "./flash-card.service";

@Module({
	imports: [TypeOrmModule.forFeature([FlashCardEntity, FlashCardSetEntity]), UsersModule],
	providers: [FlashCardService],
	controllers: [FlashCardController],
	exports: [FlashCardService]
})
export class FlashCardModule {}
