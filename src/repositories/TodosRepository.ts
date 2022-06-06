import { Todo } from "src/entities/Todo";
import { document } from "../utils/dynamodbClient";

export namespace TodosRepository {
	export async function create(todo: Todo): Promise<void> {
		await document
			.put(
				{
					TableName: "todos",
					Item: todo,
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();
	}

	export async function deleteTodo(id: string): Promise<void> {
		await document
			.delete(
				{
					TableName: "todos",
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

	export async function deleteAllByUserId(user_id: string): Promise<void> {
		const { Items: todos } = await document
			.scan(
				{
					TableName: "todos",
					FilterExpression: "user_id = :user_id",
					ExpressionAttributeValues: {
						":user_id": user_id,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		todos.forEach(async (todo) => {
			await document
				.delete(
					{
						TableName: "todos",
						Key: {
							id: todo.id,
						},
					},
					(err, response) => {
						console.log(err, response);
					}
				)
				.promise();
		});
	}

	export async function list(): Promise<Todo[]> {
		const { Items: todos } = await document
			.scan(
				{
					TableName: "todos",
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return todos as Todo[];
	}

	export async function listByUserId(user_id: string): Promise<Todo[]> {
		const { Items: todos } = await document
			.scan(
				{
					TableName: "todos",
					FilterExpression: "user_id = :user_id",
					ExpressionAttributeValues: {
						":user_id": user_id,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return todos as Todo[];
	}

	export async function getById(id: string): Promise<Todo> {
		const { Item: todo } = await document
			.get(
				{
					TableName: "todos",
					Key: {
						id,
					},
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return todo as Todo;
	}

	export async function updateDoneProp(id: string, done: boolean = false): Promise<Todo> {
		const { Attributes: todo } = await document
			.update(
				{
					TableName: "todos",
					Key: {
						id,
					},
					UpdateExpression: "SET done = :done",
					ExpressionAttributeValues: {
						":done": done,
					},
					ReturnValues: "ALL_NEW",
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return todo as Todo;
	}
	export async function update(id: string, todo: Todo): Promise<Todo> {
		const { Attributes: newTodo } = await document
			.update(
				{
					TableName: "todos",
					Key: {
						id,
					},
					UpdateExpression:
						"SET done = :done, deadline = :deadline, title = :title, user_id = :user_id",
					ExpressionAttributeValues: {
						":done": todo.done,
						":deadline": todo.deadline,
						":title": todo.title,
						":user_id": todo.user_id,
					},
					ReturnValues: "ALL_NEW",
				},
				(err, response) => {
					console.log(err, response);
				}
			)
			.promise();

		return newTodo as Todo;
	}
}
