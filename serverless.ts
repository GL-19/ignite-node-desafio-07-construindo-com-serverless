import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
	service: "ignite-node-desafio-07-construindo-com-serverless",
	frameworkVersion: "3",
	plugins: ["serverless-esbuild", "serverless-dynamodb-local", "serverless-offline"],
	provider: {
		name: "aws",
		region: "sa-east-1",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
		},
	},
	// import the function via paths
	functions: {
		createTodo: {
			handler: "src/functions/todos/createTodo.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}",
						method: "post",
						cors: true,
					},
				},
			],
		},
		listTodos: {
			handler: "src/functions/todos/listTodos.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}",
						method: "get",
						cors: true,
					},
				},
			],
		},
		getTodo: {
			handler: "src/functions/todos/getTodo.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}/{todo_id}",
						method: "get",
						cors: true,
					},
				},
			],
		},
		updateTodoDoneProp: {
			handler: "src/functions/todos/updateTodoDoneProp.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}/{todo_id}",
						method: "patch",
						cors: true,
					},
				},
			],
		},
		deleteTodo: {
			handler: "src/functions/todos/deleteTodo.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}/{todo_id}",
						method: "delete",
						cors: true,
					},
				},
			],
		},
		updateTodo: {
			handler: "src/functions/todos/updateTodo.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}/{todo_id}",
						method: "put",
						cors: true,
					},
				},
			],
		},
		deleteAllTodosByUser: {
			handler: "src/functions/todos/deleteAllTodosByUser.handler",
			events: [
				{
					http: {
						path: "todos/{user_id}",
						method: "delete",
						cors: true,
					},
				},
			],
		},
		getUser: {
			handler: "src/functions/users/getUser.handler",
			events: [
				{
					http: {
						path: "users/{user_id}",
						method: "get",
						cors: true,
					},
				},
			],
		},
		updateUser: {
			handler: "src/functions/users/updateUser.handler",
			events: [
				{
					http: {
						path: "users/{user_id}",
						method: "put",
						cors: true,
					},
				},
			],
		},
		deleteUser: {
			handler: "src/functions/users/deleteUser.handler",
			events: [
				{
					http: {
						path: "users/{user_id}",
						method: "delete",
						cors: true,
					},
				},
			],
		},
		listUsers: {
			handler: "src/functions/users/listUsers.handler",
			events: [
				{
					http: {
						path: "users",
						method: "get",
						cors: true,
					},
				},
			],
		},
		createUser: {
			handler: "src/functions/users/createUser.handler",
			events: [
				{
					http: {
						path: "users",
						method: "post",
						cors: true,
					},
				},
			],
		},
	},
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
		dynamodb: {
			stages: ["dev", "local"],
			start: {
				port: 8000,
				inMemory: true,
				migrate: true,
			},
		},
	},
	resources: {
		Resources: {
			dbTodos: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "todos",
					ProvisionedThroughput: {
						ReadCapacityUnits: 5,
						WriteCapacityUnits: 5,
					},
					AttributeDefinitions: [
						{
							AttributeName: "id",
							AttributeType: "S",
						},
					],
					KeySchema: [
						{
							AttributeName: "id",
							KeyType: "HASH",
						},
					],
				},
			},
			dbUsers: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "users",
					ProvisionedThroughput: {
						ReadCapacityUnits: 5,
						WriteCapacityUnits: 5,
					},
					AttributeDefinitions: [
						{
							AttributeName: "id",
							AttributeType: "S",
						},
					],
					KeySchema: [
						{
							AttributeName: "id",
							KeyType: "HASH",
						},
					],
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
