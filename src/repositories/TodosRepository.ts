import { Todo } from "src/entities/Todo";
import { document } from "../utils/dynamodbClient";

async function createTodo(todo: Todo): Promise<void> {
	await document
		.put({
			TableName: "todos",
			Item: todo,
		})
		.promise();
}

async function deleteTodo(id: string): Promise<void> {
	await document
		.delete({
			TableName: "todos",
			Key: {
				id,
			},
		})
		.promise();
}

async function listTodos(): Promise<Todo[]> {
	const { Items: todos } = await document
		.scan({
			TableName: "todos",
		})
		.promise();

	return todos as Todo[];
}
async function listTodosByUserId(user_id: string): Promise<Todo[]> {
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

async function getTodoById(id: string): Promise<Todo> {
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

export { getTodoById, createTodo, deleteTodo, listTodos, listTodosByUserId };
