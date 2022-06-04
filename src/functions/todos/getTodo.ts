import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
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

	const userQueryResponse = await document
		.query({
			TableName: "users",
			KeyConditionExpression: "id = :id",
			ExpressionAttributeValues: {
				":id": user_id,
			},
		})
		.promise();

	const user = userQueryResponse.Items[0];

	if (!user) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
	}

	const todosQueryResponse = await document
		.query({
			TableName: "todos",
			KeyConditionExpression: "id = :id",
			ExpressionAttributeValues: {
				":id": todo_id,
			},
		})
		.promise();

	const todo = todosQueryResponse.Items[0];

	if (!todo) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "Todo not found!",
			}),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify({
			todo,
		}),
	};
};
