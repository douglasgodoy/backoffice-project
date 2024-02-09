import { Request, Response } from 'express';
import {
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
import teacherInstance from 'src/services/teacher/dynamo';

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
      teacher,
    });
  } catch (error) {
    console.error('ERROR ON TEACHER CREATION:', error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
