import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const date = new Date();

		response.status(status).json({
			body: {
				messages: [exception.message]
			},
			statusCode: status,
			timestamp: `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
			path: request.url
		});
	}
}
