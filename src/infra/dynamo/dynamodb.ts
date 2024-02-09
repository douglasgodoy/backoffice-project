import AWS from 'aws-sdk';
import { DatabaseType } from './types';

const dynamodb: DatabaseType = {
  startDatabase: async () => {
    await dynamodb.createTableIfNotExists();
  },

  createTableIfNotExists: async () => {
    const db = new AWS.DynamoDB({
      region: process.env.DB_REGION,
      endpoint: process.env.DB_URI,
    });

    const params = {
      TableName: <string>process.env.DYNAMO_TABLE,

      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'DateClass', AttributeType: 'S' },
        { AttributeName: 'ClassTitle', AttributeType: 'S' },
        { AttributeName: 'Status', AttributeType: 'S' },
        { AttributeName: 'Username', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' }, // Partition Key
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI-SK',
          KeySchema: [{ AttributeName: 'SK', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Status',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'Status', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-DateClass',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'DateClass', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-ClassTitle',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'ClassTitle', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Username',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'Username', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 5,
      },
    };

    db.createTable(params, (err, data) => {
      if (err) {
        if (err.code === 'ResourceInUseException') {
          console.log('Table already exists');
          return;
        }

        if (err.code === 'ResourceNotFoundException') {
          db.createTable(params, (err, data) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('Table created successfully:', data);
            }
          });
        } else {
          console.error(
            'Error describing table:',
            JSON.stringify(err, null, 2),
          );
        }
      } else {
        console.log(
          'Table already exists. Table description JSON:',
          JSON.stringify(data, null, 2),
        );
      }
    });
  },
};

export default dynamodb;
