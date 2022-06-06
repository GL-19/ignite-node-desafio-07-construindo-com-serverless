import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";
import { User } from "src/entities/User";
import { Errors } from "src/errors/Errors";

interface IRequestBody {
	name: string;
	email: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { name, email } = JSON.parse(event.body) as IRequestBody;

		if (!name || !email) {
			throw new Errors.InvalidRequestBody();
		}

		const userExists = await UsersRepository.getByEmail(email);

		if (userExists) {
			throw new Errors.UserAlreadyExists();
		}

		const user = new User(name, email);

		await UsersRepository.create(user);

		return {
			statusCode: 201,
			body: JSON.stringify({
				message: "User created!",
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
