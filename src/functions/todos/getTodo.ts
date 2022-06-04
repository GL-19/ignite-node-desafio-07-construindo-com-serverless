import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { id } = event.pathParameters;

		const response = await document
			.query({
				TableName: "todos",
				KeyConditionExpression: "id = :id",
				ExpressionAttributeValues: {
					":id": id,
				},
			})
			.promise();

		if (response.Items.length < 1) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: "Todo not found!",
				}),
			};
		}
		return {
			statusCode: 200,
			body: JSON.stringify({
				todo: response.Items[0],
			}),
		};
	} catch (err) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "Todo not found!",
			}),
		};
	}
};
