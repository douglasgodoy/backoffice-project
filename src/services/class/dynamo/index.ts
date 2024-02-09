import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import ClassDynamoService from './ClassDynamoService';

const dynamoInstance = DynamoDBSingleton.getInstance();
const classInstance = new ClassDynamoService(dynamoInstance);

export { classInstance };
