import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { v4 as uuid, validate } from "uuid";

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
	const { title, deadline } = JSON.parse(event.body) as IRequestBody;
	const { id: user_id } = event.pathParameters;

	if (!title || !deadline) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid body data!",
			}),
		};
	}

	const isValidId = validate(user_id);

	if (!isValidId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid user id!",
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

	if (userQueryResponse.Items[0].length < 1) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
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
};
