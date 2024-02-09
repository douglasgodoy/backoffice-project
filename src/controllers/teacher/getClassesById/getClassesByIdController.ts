import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { Request, Response } from 'express';
import TeacherDynamoService from 'src/services/teacher/dynamo/TeacherDynamoService';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NO_CONTENT_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import { ClassFromDatabase, ClassFromHttp } from './types';
const dynamoInstance = DynamoDBSingleton.getInstance();
const teacherInstance = new TeacherDynamoService(dynamoInstance);

export default async function getClassesByIdController(
  req: Request,
  res: Response,
) {
  const { teacherId } = req.params;

  try {
    const getClasses = await teacherInstance.getClassesById(
      `CLASS#${teacherId}`,
    );

    const classes = getClasses.Items || [];

    if (!classes.length) {
      return NO_CONTENT_HTTP_RESPONSE(res);
    }

    const parsedResponse = adapterClass(classes as ClassFromDatabase[]);

    return SUCCESS_HTTP_RESPONSE(res, {
      classes: parsedResponse,
    });
  } catch (error) {
    console.error('ERROR ON GET CLASSES BY TEACHER', error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
function adapterClass(classes: ClassFromDatabase[]): ClassFromHttp[] {
  return classes.map((classItem: ClassFromDatabase) => {
    return {
      id: classItem.PK,
      classDate: classItem.ClassDate,
      title: classItem.ClassTitle,
      description: classItem.Description,
      teacher: classItem.Username,
    };
  });
}
