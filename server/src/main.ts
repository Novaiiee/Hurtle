import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/global-exception.filter";
import { GlobalTransformInterceptor } from "./common/global-transform.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);

	app.use(cookieParser());
	app.use(helmet());
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new GlobalTransformInterceptor());

	const config = new DocumentBuilder()
		.setTitle("Hurtle API")
		.setDescription("The Hurtle API description")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);

	await app.listen(configService.get("PORT"));
}

bootstrap();
