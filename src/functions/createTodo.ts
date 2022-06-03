import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuid } from "uuid";

interface IRequestBody {
	title: string;
	deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { title, deadline } = JSON.parse(event.body) as IRequestBody;
		const { id: user_id } = event.pathParameters;

		const id = uuid();

		await document
			.put({
				TableName: "todos",
				Item: {
					id,
					user_id,
					title,
					done: false,
					deadline: new Date(deadline),
				},
			})
			.promise();

		const response = await document
			.query({
				TableName: "todos",
				KeyConditionExpression: "id = :id",
				ExpressionAttributeValues: {
					":id": id,
				},
			})
			.promise();

		return {
			statusCode: 201,
			body: JSON.stringify({
				message: "Todo criado com sucesso!",
				todo: response.Items[0],
			}),
		};
	} catch (err) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Could not create todo",
			}),
		};
	}
};
