import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { Request, Response } from 'express';
import TeacherDynamoService from 'src/services/teacher/dynamo/TeacherDynamoService';
import {
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
const dynamoInstance = DynamoDBSingleton.getInstance();
const teacherInstance = new TeacherDynamoService(dynamoInstance);

export default async function getTeacherByIdController(
  req: Request,
  res: Response,
) {
  const { userName } = req.params;

  try {
    const UserAlreadyExists = await teacherInstance.getByUsername(
      userName,
      'CUSTOMER#TEACHER',
    );

    const teacher = UserAlreadyExists.Items?.[0];
    return CREATED_HTTP_RESPONSE(res, {
      //TODO -
      teacher,
    });
  } catch (error) {
    console.error('ERROR ON TEACHER CREATION:', error);

    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
