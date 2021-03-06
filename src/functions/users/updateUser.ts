import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { Errors } from "src/errors/Errors";
import { UsersRepository } from "src/repositories/UsersRepository";

interface IRequestBody {
	id: string;
	name: string;
	email: string;
	created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;
		const { id, name, email, created_at } = JSON.parse(event.body) as IRequestBody;

		if (!name || !email || !created_at || !id) {
			throw new Errors.InvalidRequestBody();
		}

		const user = await UsersRepository.getById(user_id);

		if (!user) {
			throw new Errors.UserNotFound();
		}

		const newUser = await UsersRepository.update(user_id, {
			...user,
			name,
			email,
			created_at,
		});

		return {
			statusCode: 201,
			body: JSON.stringify({
				user: newUser,
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
