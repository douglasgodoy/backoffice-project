import { DocumentClient } from 'aws-sdk/clients/dynamodb';

class ClassDynamoService {
  constructor(private dynamoInstance: DocumentClient) {}

  async createClass({
    PK,
    SK,
    Username,
    Description,
    ClassDate,
    ClassTitle,
  }: {
    PK: string;
    SK: string;
    Username: string;
    Description: string;
    ClassDate: string;
    ClassTitle: string;
  }): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: <string>process.env.DYNAMO_TABLE,
      Item: {
        PK,
        SK,
        Username,
        Description,
        ClassDate,
        ClassTitle,
      },
    };

    return await this.dynamoInstance.put(params).promise();
  }
}

export default ClassDynamoService;
