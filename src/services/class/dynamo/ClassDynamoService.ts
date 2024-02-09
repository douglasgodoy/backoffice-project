import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ParseUpdateDynamo } from 'src/controllers/class/update/types';
import { UpdateClassTypeParams } from './types';
import { validateProperties } from './decorators';
class ClassDynamoService {
  constructor(private dynamoInstance: DocumentClient) {}

  @validateProperties(['id', 'body', 'teacherId'])
  async updateClass({ id, body, teacherId }: UpdateClassTypeParams) {
    let parseBodyToUpdate: ParseUpdateDynamo = {};

    const adapterToDynamoFields = {
      classDate: 'ClassDate',
      description: 'Description',
      title: 'ClassTitle',
    };

    for (const key in body) {
      //@ts-ignore
      const dynamoKey = adapterToDynamoFields[key];
      parseBodyToUpdate[dynamoKey] = {
        Action: 'PUT',
        //@ts-ignore
        Value: body[key],
      };
    }

    if (body['classDate']) {
      parseBodyToUpdate['ClassDate'] = {
        Action: 'PUT',
        Value: new Date(body['classDate']).toISOString(),
      };
    }

    const params: DocumentClient.UpdateItemInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      AttributeUpdates: {
        ...parseBodyToUpdate,
        UpdatedAt: {
          Action: 'PUT',
          Value: new Date().toISOString(),
        },
      },
      Key: {
        PK: id,
        SK: `CLASS#${teacherId}`,
      },
    };

    return await this.dynamoInstance.update(params).promise();
  }

  @validateProperties([
    'PK',
    'SK',
    'Username',
    'Description',
    'ClassDate',
    'ClassTitle',
  ])
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

  @validateProperties(['PK'])
  async getClassById(PK: string) {
    const params: DocumentClient.QueryInput = {
      TableName: <string>process.env.DYNAMO_TABLE,
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': PK,
      },
    };

    return await this.dynamoInstance.query(params).promise();
  }
}

export default ClassDynamoService;
