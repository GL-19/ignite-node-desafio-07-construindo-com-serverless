import { document } from "../utils/dynamodbClient";
import { User } from "src/entities/User";

export namespace UsersRepository {
	export async function create(user: User): Promise<void> {
		await document
			.put(
				{
					TableName: "users",
					Item: user,
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();
	}

	export async function deleteUser(id: string): Promise<void> {
		await document
			.delete(
				{
					TableName: "users",
					Key: {
						id,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();
	}

	export async function list(): Promise<User[]> {
		const { Items: users } = await document
			.scan(
				{
					TableName: "users",
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return users as User[];
	}

	export async function getById(id: string): Promise<User> {
		const { Item: user } = await document
			.get(
				{
					TableName: "users",
					Key: {
						id,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return user as User;
	}

	export async function getByEmail(email: string): Promise<User> {
		const {
			Items: [user],
		} = await document
			.scan(
				{
					TableName: "users",
					FilterExpression: "email = :email",
					ExpressionAttributeValues: {
						":email": email,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return user as User;
	}

	export async function update(id: string, user: User): Promise<User> {
		const { Attributes: newUser } = await document
			.update(
				{
					TableName: "users",
					Key: {
						id,
					},
					UpdateExpression:
						"SET #nm = :newName, email = :email, created_at = :created_at",
					ExpressionAttributeValues: {
						":newName": user.name,
						":email": user.email,
						":created_at": user.created_at,
					},
					ExpressionAttributeNames: {
						"#nm": "name",
					},
					ReturnValues: "ALL_NEW",
				},
				(err, data) => {
					console.log("Error Data: ", data);
					console.log("Error: ", err);
				}
			)
			.promise();

		return newUser as User;
	}
}
