import { Request, Response } from 'express';
import {
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
import { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { tokenInstance } from 'src/services/teacher/auth';
import { classInstance } from 'src/services/class/dynamo';

export default async function registerNewClassController(
  req: Request,
  res: Response,
) {
  try {
    const { title, description, classDate } = req.body;
    // TODO - validation to verify token
    const token = req.headers['authorization']?.replace(/Bearer /g, '') || '';

    const { payload } = tokenInstance.verify(token) as JwtPayload;

    const parsedToken = {
      id: payload.id,
      username: payload.userName,
    };

    const classId = uuidv4();
    const newClass = parseClass({
      id: classId,
      title,
      description,
      classDate: new Date(classDate).toISOString(),
      token: parsedToken,
    });

    await classInstance.createClass(newClass);

    return CREATED_HTTP_RESPONSE(res, {
      title,
      description,
      classDate,
      id: classId,
    });
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}

function parseClass({
  id,
  title,
  description,
  classDate,
  token,
}: {
  id: string;
  title: string;
  description: string;
  classDate: string;
  token: { id: string; username: string };
}) {
  return {
    PK: id,
    SK: `CLASS#${token.id}`,
    Username: token.username,
    Description: description,
    ClassDate: classDate,
    ClassTitle: title,
  };
}
