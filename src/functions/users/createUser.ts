import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { v4 as uuid } from "uuid";
import { AppError } from "src/errors/AppError";

interface IRequestBody {
	name: string;
	email: string;
}

interface IUserData {
	id: string;
	name: string;
	email: string;
	created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { name, email } = JSON.parse(event.body) as IRequestBody;

		if (!name || !email) {
			throw new AppError("Invalid body data!", 400);
		}

		const response = await document
			.scan({
				TableName: "users",
				FilterExpression: "email = :email",
				ExpressionAttributeValues: {
					":email": email,
				},
			})
			.promise();

		const user = response.Items[0];

		if (user) {
			throw new AppError("User already Exists!", 400);
		}

		const userData: IUserData = {
			id: uuid(),
			name,
			email,
			created_at: new Date().toDateString(),
		};

		await document
			.put({
				TableName: "users",
				Item: userData,
			})
			.promise();

		return {
			statusCode: 201,
			body: JSON.stringify({
				message: "User created!",
				user: userData,
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
