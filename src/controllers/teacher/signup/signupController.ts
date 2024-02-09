import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import TeacherAuthService from 'src/services/teacher/auth/TeacherAuthService';
import TeacherDynamoService from 'src/services/teacher/dynamo/TeacherDynamoService';
import {
  BAD_REQUEST_HTTP_RESPONSE,
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
import { v4 as uuidv4 } from 'uuid';
import { TEACHER_STATUS } from 'src/utils/constants';

const auth = new TeacherAuthService(bcrypt);
const dynamoInstance = DynamoDBSingleton.getInstance();
const teacherInstance = new TeacherDynamoService(dynamoInstance);

export default async function signupController(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const teacher = await teacherInstance.getByUsername(
      username,
      'CUSTOMER#TEACHER',
    );

    if (teacher.Count) {
      return BAD_REQUEST_HTTP_RESPONSE(res, undefined, 'User already exists');
    }

    const id = uuidv4();
    const hash = await auth.hash(password);

    const newTeacher = parseTeacher({ hash, id, username });
    await teacherInstance.createTeacher(newTeacher);

    return CREATED_HTTP_RESPONSE(res, { id });
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}

function parseTeacher({
  hash,
  id,
  username,
}: {
  hash: string;
  id: string;
  username: string;
}) {
  return {
    Username: username,
    Password: hash,
    Status: TEACHER_STATUS.PENDING,
    SK: 'CUSTOMER#TEACHER',
    PK: id,
  };
}
