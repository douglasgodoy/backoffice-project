import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import TeacherDynamoService from './TeacherDynamoService';

const dynamoInstance = DynamoDBSingleton.getInstance();
const teacherInstance = new TeacherDynamoService(dynamoInstance);

export default teacherInstance;
