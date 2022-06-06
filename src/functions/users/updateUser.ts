/* import { APIGatewayProxyHandler } from "aws-lambda";

interface IRequestBody {
	name: string;
	email: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	const { user_id } = event.pathParameters;
	const { name, email } = JSON.parse(event.body) as IRequestBody;
}; */
