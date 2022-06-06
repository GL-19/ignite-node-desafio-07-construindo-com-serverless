import { AppError } from "./AppError";
export namespace Errors {
	export class UserNotFound extends AppError {
		constructor() {
			super("User Not Found!", 404);
		}
	}

	export class TodoNotFound extends AppError {
		constructor() {
			super("Todo Not Found!", 404);
		}
	}

	export class UserAlreadyExists extends AppError {
		constructor() {
			super("User Already Exists!", 400);
		}
	}

	export class TodoAlreadyExists extends AppError {
		constructor() {
			super("Todo Already Exists!", 400);
		}
	}

	export class Forbidden extends AppError {
		constructor() {
			super("Forbidden!", 403);
		}
	}
	export class InvalidRequestBody extends AppError {
		constructor() {
			super("Invalid Request Body!", 400);
		}
	}
}
