import { Request, Response } from 'express';
import {
  BAD_REQUEST_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_AUTHORIZED_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import { TEACHER_STATUS } from 'src/utils/constants';
import teacherInstance from 'src/services/teacher/dynamo';
import { auth, tokenInstance } from 'src/services/teacher/auth';

export const verifyPasswordLength = (password: string) => {
  return password.length >= 5 ? true : false;
};

export default async function signinController(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!verifyPasswordLength(password)) {
      return BAD_REQUEST_HTTP_RESPONSE(res, undefined, 'Invalid Password');
    }

    const teacher = await teacherInstance.getByUsername(
      username,
      'CUSTOMER#TEACHER',
      true,
    );

    if (!teacher.Count) {
      return NOT_FOUND_HTTP_RESPONSE(res, 'User not founded');
    }

    const teacherData = teacher.Items?.[0];
    if (teacherData?.Status === TEACHER_STATUS.PENDING) {
      return NOT_AUTHORIZED_HTTP_RESPONSE(res, 'User not authorized');
    }

    const comparePass = await auth.compare(password, teacherData?.Password);
    if (!comparePass) {
      return BAD_REQUEST_HTTP_RESPONSE(
        res,
        undefined,
        'The userName or password is invalid',
      );
    }

    const payload = {
      id: teacherData?.PK,
      userName: teacherData?.Username,
    };

    const token = await tokenInstance.sign(payload);

    return SUCCESS_HTTP_RESPONSE(res, { ...payload, token });
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR_HTTP_RESPONSE(res);
  }
}
