import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { v4 as uuid } from "uuid";
import { AppError } from "src/errors/AppError";
import * as usersRepository from "../../repositories/UsersRepository";

interface IRequestBody {
	title: string;
	deadline: string;
}

interface ITodoData {
	id: string;
	user_id: string;
	title: string;
	deadline: string;
	done: boolean;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { title, deadline } = JSON.parse(event.body) as IRequestBody;
		const { user_id } = event.pathParameters;

		if (!title || !deadline) {
			throw new AppError("Invalid body data!", 400);
		}

		const user = await usersRepository.getUserById(user_id);

		if (!user) {
			throw new AppError("User not found!", 404);
		}

		const todoData: ITodoData = {
			id: uuid(),
			user_id,
			title,
			done: false,
			deadline: new Date(deadline).toDateString(),
		};

		await document
			.put({
				TableName: "todos",
				Item: todoData,
			})
			.promise();

		return {
			statusCode: 201,
			body: JSON.stringify({
				message: "Todo created!",
				todo: todoData,
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
