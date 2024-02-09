import { TeacherTokenService } from 'src/services/teacher/auth/TeacherTokenService';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_AUTHORIZED_HTTP_RESPONSE,
} from 'src/utils/http';
import { Request, Response, NextFunction } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';
const tokenInstance = new TeacherTokenService(jwt);

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['authorization']?.replace(/Bearer /g, '') || '';
    if (!token.length)
      return NOT_AUTHORIZED_HTTP_RESPONSE(res, 'Invalid token');

    const { payload } = tokenInstance.verify(token) as JwtPayload;

    if (!payload) {
      return NOT_AUTHORIZED_HTTP_RESPONSE(res, 'Invalid token');
    }

    return next();
  } catch (error) {
    console.error('Error on validate Token', error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
};
