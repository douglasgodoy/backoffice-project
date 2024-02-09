import { TeacherTokenService } from 'src/services/teacher/auth/TeacherTokenService';
import { NOT_AUTHORIZED_HTTP_RESPONSE } from 'src/utils/http';
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

    const { payload = null } = tokenInstance.verify(token) as JwtPayload;

    if (!payload) {
      return NOT_AUTHORIZED_HTTP_RESPONSE(res, 'Invalid token');
    }

    req.headers.teacherId = payload.id;
    return next();
  } catch (error) {
    return NOT_AUTHORIZED_HTTP_RESPONSE(res, 'Invalid token');
  }
};
