import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { validate } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
	const { user_id, todo_id } = event.pathParameters;

	const isValidUserId = validate(user_id);

	if (!isValidUserId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid user id!",
			}),
		};
	}

	const isValidTodoId = validate(todo_id);

	if (!isValidTodoId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid todo id!",
			}),
		};
	}

	const user = await document
		.get({
			TableName: "users",
			Key: {
				id: user_id,
			},
		})
		.promise();

	if (Object.keys(user).length < 1) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
	}

	const todo = await document
		.get({
			TableName: "todos",
			Key: {
				id: todo_id,
			},
		})
		.promise();

	if (Object.keys(todo).length < 1) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "Todo not found!",
			}),
		};
	}

	await document
		.delete({
			TableName: "todos",
			Key: {
				id: todo_id,
			},
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Todo deleted!",
			todo,
		}),
	};
};
