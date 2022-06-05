import { APIGatewayProxyHandler } from "aws-lambda";
import { validate } from "uuid";

interface IRequestBody {
	name: string;
	email: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	const { user_id } = event.pathParameters;
	const { name, email } = JSON.parse(event.body) as IRequestBody;

	const validId = validate(user_id);

	if (!validId)
		if (!name || !email) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: "Incorrect body format!",
				}),
			};
		}
};
