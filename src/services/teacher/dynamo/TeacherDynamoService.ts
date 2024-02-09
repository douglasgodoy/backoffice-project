import { DocumentClient } from 'aws-sdk/clients/dynamodb';

class TeacherDynamoService {
  constructor(private dynamoInstance: AWS.DynamoDB.DocumentClient) {}

  async createTeacher(valueParams: {
    Username: any;
    Password: string;
    Status: string;
  }): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: <string>process.env.DYNAMO_TABLE,
      Item: valueParams,
      ReturnValues: 'ALL_OLD',
    };

    return await this.dynamoInstance.put(params).promise();
  }

  async getByUsername(
    username: string,
    SK: string,
    getPass = false,
  ): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
    const params: DocumentClient.QueryInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      IndexName: 'GSI-Username',
      KeyConditionExpression: 'SK = :SK AND Username = :username',
      ExpressionAttributeValues: {
        ':username': username,
        ':SK': SK,
      },
    };

    if (!getPass) {
      params.ProjectionExpression = 'SK,PK,Username,#status';
      params.ExpressionAttributeNames = {
        '#status': 'Status',
      };
    }

    return await this.dynamoInstance.query(params).promise();
  }

  async getById(
    id: string,
    SK: string,
    getPass = false,
  ): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
    const params: DocumentClient.QueryInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      KeyConditionExpression: 'SK = :SK AND PK = :id',
      ExpressionAttributeValues: {
        ':id': id,
        ':SK': SK,
      },
    };

    if (!getPass) {
      params.ProjectionExpression = 'SK,PK,Username,#status';
      params.ExpressionAttributeNames = {
        '#status': 'Status',
      };
    }

    return await this.dynamoInstance.query(params).promise();
  }

  async approveTeacherStatus(id: string) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      AttributeUpdates: {
        Status: {
          Action: 'PUT',
          Value: 'APPROVED',
        },
        ApprovedDate: {
          Action: 'PUT',
          Value: new Date().toISOString(),
        },
      },
      Key: {
        PK: id,
        SK: 'CUSTOMER#TEACHER',
      },
    };

    return await this.dynamoInstance.update(params).promise();
  }

  async getClassesById(SK: string) {
    const params: DocumentClient.QueryInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      IndexName: 'GSI-SK',
      KeyConditionExpression: 'SK = :SK',
      ExpressionAttributeValues: {
        ':SK': SK,
      },
    };

    return await this.dynamoInstance.query(params).promise();
  }
}

export default TeacherDynamoService;
