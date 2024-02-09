import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { Request, Response } from 'express';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import ClassDynamoService from 'src/services/class/dynamo/ClassDynamoService';
import { BodyRequest } from './types';
const dynamoInstance = DynamoDBSingleton.getInstance();
const classInstance = new ClassDynamoService(dynamoInstance);

export default async function updateClassController(
  req: Request,
  res: Response,
) {
  // TODO - VALIDATE ID EXIST AT LEAST 1 FIELD IN OBJECT
  const body: BodyRequest = req.body;
  const { classId } = req.params;
  const { teacherId } = req.headers || '';

  try {
    const getClasses = await classInstance.getClassById(classId);

    const classes = getClasses.Items || [];
    if (!classes.length) {
      return NOT_FOUND_HTTP_RESPONSE(res, 'Class not founded');
    }

    await classInstance.updateClass({
      id: classId,
      body,
      teacherId: teacherId as string,
    });

    return SUCCESS_HTTP_RESPONSE(res, { ...body, id: classId });
  } catch (error) {
    console.error('ERROR ON CLASS UPDATE:', error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
