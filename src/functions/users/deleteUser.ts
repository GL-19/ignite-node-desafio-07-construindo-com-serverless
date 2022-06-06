import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;

		const user = await UsersRepository.getById(user_id);

		if (!user) {
			throw new AppError(`User not found!`, 404);
		}

		await UsersRepository.deleteUser(user_id);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "User deleted!",
				user,
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
