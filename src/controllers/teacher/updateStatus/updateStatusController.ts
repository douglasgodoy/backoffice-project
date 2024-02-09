import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { Request, Response } from 'express';
import TeacherDynamoService from 'src/services/teacher/dynamo/TeacherDynamoService';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
const dynamoInstance = DynamoDBSingleton.getInstance();
const teacherInstance = new TeacherDynamoService(dynamoInstance);

export default async function updateStatusController(
  req: Request,
  res: Response,
) {
  const { id } = req.body;
  try {
    const UserAlreadyExists = await teacherInstance.getById(
      id,
      'CUSTOMER#TEACHER',
    );
    if (!UserAlreadyExists.Count) {
      return NOT_FOUND_HTTP_RESPONSE(res, 'User not founded');
    }

    await teacherInstance.approveTeacherStatus(id);

    return SUCCESS_HTTP_RESPONSE(res, { id });
  } catch (error) {
    console.error('ERROR ON TEACHER UPDATE STATUS:', error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
