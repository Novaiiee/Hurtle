import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				url: config.get("DATABASE_CONNECTION"),
				synchronize: process.env.NODE_ENV === "production" ? false : true,
				autoLoadEntities: true,
				extra: {
					ssl: {
						rejectUnauthorized: false
					}
				}
			}),
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	exports: [TypeOrmModule]
})
export class DatabaseModule {}
