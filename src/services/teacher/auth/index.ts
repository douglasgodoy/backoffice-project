import TeacherAuthService from './TeacherAuthService';
import bcrypt from 'bcrypt';
import { TeacherTokenService } from './TeacherTokenService';
import jwt from 'jsonwebtoken';

const auth = new TeacherAuthService(bcrypt);
const tokenInstance = new TeacherTokenService(jwt);

export { auth, tokenInstance };
