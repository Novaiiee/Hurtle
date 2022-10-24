import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get<ConfigService>(ConfigService);

	app.use(cookieParser());
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());

	await app.listen(config.get("PORT"));
}

bootstrap();
