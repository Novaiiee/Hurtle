import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface GlobalResponse<T> {
	data: T;
	statusCode: number;
	status: string;
	timestamp: string;
	path: string;
}

@Injectable()
export class GlobalTransformInterceptor<T> implements NestInterceptor<T, GlobalResponse<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<GlobalResponse<T>> {
		const ctx = context.switchToHttp();
		const res: Response = ctx.getResponse();
		const req: Request = ctx.getRequest();

		const date = new Date();

		return next.handle().pipe(
			map((data) => ({
				statusCode: res.statusCode,
				status: res.statusMessage,
				timestamp: `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
				path: req.url,
				data
			}))
		);
	}
}
