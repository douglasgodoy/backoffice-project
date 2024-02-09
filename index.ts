import { startApp } from 'src/server';
import dotenv from 'dotenv';
import dynamodb from 'src/infra/dynamo/dynamodb';

dotenv.config();

dynamodb.startDatabase().then(startApp);
