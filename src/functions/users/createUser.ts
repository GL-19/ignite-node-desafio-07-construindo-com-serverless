import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { AppError } from "src/errors/AppError";
import * as usersRepository from "../../repositories/UsersRepository";
import { User } from "src/types/User";

interface IRequestBody {
	name: string;
	email: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { name, email } = JSON.parse(event.body) as IRequestBody;

		if (!name || !email) {
			throw new AppError("Invalid body data!", 400);
		}

		const userExists = await usersRepository.getUserByEmail(email);

		if (userExists) {
			throw new AppError("User already Exists!", 400);
		}

		const user = new User(name, email);

		await document
			.put({
				TableName: "users",
				Item: user,
			})
			.promise();

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
