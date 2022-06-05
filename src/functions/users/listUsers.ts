import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { document } from "../../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async () => {
	try {
		const response = await document
			.scan({
				TableName: "users",
			})
			.promise();

		return {
			statusCode: 200,
			body: JSON.stringify({
				users: response.Items,
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
