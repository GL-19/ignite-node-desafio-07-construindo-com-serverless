import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";

export const handler: APIGatewayProxyHandler = async () => {
	try {
		const users = await UsersRepository.list();

		return {
			statusCode: 200,
			body: JSON.stringify({
				users,
			}),
		};
	} catch (err) {
		if (err instanceof AppError) {
			return {
				statusCode: err.statusCode,
				body: JSON.stringify({
					message: err.message,
				}),
			};
		} else {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: "Internal Server Error!",
				}),
			};
		}
	}
};
