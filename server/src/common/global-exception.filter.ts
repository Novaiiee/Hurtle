import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const date = new Date();

		response.status(status).json({
			statusCode: status,
			timestamp: `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
			path: request.url,
			data: {
				errors: (exception.getResponse() as any).message
			}
		});
	}
}
