import { Todo } from "src/entities/Todo";
import { document } from "../utils/dynamodbClient";

export namespace TodosRepository {
	export async function create(todo: Todo): Promise<void> {
		await document
			.put({
				TableName: "todos",
				Item: todo,
			})
			.promise();
	}

	export async function deleteTodo(id: string): Promise<void> {
		await document
			.delete({
				TableName: "todos",
				Key: {
					id,
				},
			})
			.promise();
	}

	export async function deleteAllByUserId(user_id: string): Promise<void> {
		const { Items: todos } = await document
			.scan({
				TableName: "todos",
				FilterExpression: "user_id = :user_id",
				ExpressionAttributeValues: {
					":user_id": user_id,
				},
			})
			.promise();

		todos.forEach(async (todo) => {
			await document
				.delete({
					TableName: "todos",
					Key: {
						id: todo.id,
					},
				})
				.promise();
		});
	}

	export async function list(): Promise<Todo[]> {
		const { Items: todos } = await document
			.scan({
				TableName: "todos",
			})
			.promise();

		return todos as Todo[];
	}

	export async function listByUserId(user_id: string): Promise<Todo[]> {
		const { Items: todos } = await document
			.scan({
				TableName: "todos",
				FilterExpression: "user_id = :user_id",
				ExpressionAttributeValues: {
					":user_id": user_id,
				},
			})
			.promise();

		return todos as Todo[];
	}

	export async function getById(id: string): Promise<Todo> {
		const { Item: todo } = await document
			.get({
				TableName: "todos",
				Key: {
					id,
				},
			})
			.promise();

		return todo as Todo;
	}
}
