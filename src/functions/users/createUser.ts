import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { v4 as uuid } from "uuid";

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
	const { name, email } = JSON.parse(event.body) as IRequestBody;

	if (!name || !email) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid body data!",
			}),
		};
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

	if (response.Items[0]) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "User already Exists!",
			}),
		};
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
};
