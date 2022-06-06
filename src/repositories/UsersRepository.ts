import { document } from "../utils/dynamodbClient";
import { User } from "src/types/User";

async function createUser(user: User): Promise<void> {
	await document
		.put({
			TableName: "users",
			Item: user,
		})
		.promise();
}

async function deleteUser(id: User): Promise<void> {
	await document
		.delete({
			TableName: "users",
			Key: {
				id,
			},
		})
		.promise();
}

async function listUsers(): Promise<User[]> {
	const { Items: users } = await document
		.scan({
			TableName: "users",
		})
		.promise();

	return users as User[];
}

async function getUserById(id: string): Promise<User> {
	const { Item: user } = await document
		.get({
			TableName: "users",
			Key: {
				id,
			},
		})
		.promise();

	return user as User;
}

async function getUserByEmail(email: string): Promise<User> {
	const {
		Items: [user],
	} = await document
		.scan({
			TableName: "users",
			FilterExpression: "email = :email",
			ExpressionAttributeValues: {
				":email": email,
			},
		})
		.promise();

	return user as User;
}

export { getUserById, getUserByEmail, createUser, deleteUser, listUsers };
