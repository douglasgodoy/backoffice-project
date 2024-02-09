import AWS from "aws-sdk";

export class DynamoDBSingleton {
    private static instance: DynamoDBSingleton;
    private dynamoDBClient: AWS.DynamoDB.DocumentClient;

    private constructor() {
        this.dynamoDBClient = new AWS.DynamoDB.DocumentClient({
            region: process.env.DB_REGION,
            endpoint: process.env.DB_URI,
        });
    }

    public static getInstance(): AWS.DynamoDB.DocumentClient {
        if (!this.instance) {
            this.instance = new DynamoDBSingleton();
        }

        return this.instance.dynamoDBClient;
    }
}
