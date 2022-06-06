import { v4 as uuid } from "uuid";

class Todo {
	id: string;
	user_id: string;
	title: string;
	deadline: string;
	done: boolean;

	constructor(user_id: string, title: string, deadline: string) {
		this.id = uuid();
		this.done = false;
		this.deadline = new Date(deadline).toDateString();
		this.user_id = user_id;
		this.title = title;
	}
}

export { Todo };
