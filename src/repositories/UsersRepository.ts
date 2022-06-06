import { document } from "../utils/dynamodbClient";
import { User } from "src/entities/User";

export namespace UsersRepository {
	export async function create(user: User): Promise<void> {
		await document
			.put({
				TableName: "users",
				Item: user,
			})
			.promise();
	}

	export async function deleteUser(id: string): Promise<void> {
		await document
			.delete({
				TableName: "users",
				Key: {
					id,
				},
			})
			.promise();
	}

	export async function list(): Promise<User[]> {
		const { Items: users } = await document
			.scan({
				TableName: "users",
			})
			.promise();

		return users as User[];
	}

	export async function getById(id: string): Promise<User> {
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

	export async function getByEmail(email: string): Promise<User> {
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
}
