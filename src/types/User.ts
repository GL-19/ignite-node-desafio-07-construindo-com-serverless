import { v4 as uuid } from "uuid";

class User {
	id: string;
	name: string;
	email: string;
	created_at: string;

	constructor(name: string, email: string) {
		this.name = name;
		this.email = email;
		this.id = uuid();
		this.created_at = new Date().toDateString();
	}
}

export { User };
