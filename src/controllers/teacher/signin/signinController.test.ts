import { Request, Response } from 'express';
import { TEACHER_STATUS } from 'src/utils/constants';
import teacherInstance from 'src/services/teacher/dynamo';
import signinController from './signinController';
import { auth, tokenInstance } from 'src/services/teacher/auth';
import {
  BAD_REQUEST_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';

jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/dynamo');
jest.mock('src/services/teacher/auth');
jest.mock('src/utils/http');
jest.mock('src/infra/dynamo/DynamoSingleton');

describe('signinController', () => {
  const mockGetByUsername = teacherInstance.getByUsername as jest.Mock;
  const mockCompare = auth.compare as jest.Mock;
  const mockSign = tokenInstance.sign as jest.Mock;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should handle successful sign-in', async () => {
    const teacherData = {
      PK: 'mockedId',
      Username: 'mockedUser',
      Password: 'mockedHash',
      Status: TEACHER_STATUS.APPROVED,
    };

    mockGetByUsername.mockResolvedValue({
      Count: 1,
      Items: [teacherData],
    });

    mockCompare.mockResolvedValue(true);

    mockSign.mockResolvedValue('mockedToken');

    mockRequest.body = { username: 'mockedUser', password: 'mockedPassword' };

    await signinController(mockRequest as Request, mockResponse as Response);

    expect(SUCCESS_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      id: 'mockedId',
      userName: 'mockedUser',
      token: 'mockedToken',
    });
  });

  test('should handle invalid password', async () => {
    mockRequest.body = { username: 'mockedUser', password: 'short' };
    mockGetByUsername.mockResolvedValue({
      Count: 1,
    });
    mockCompare.mockResolvedValue(false);

    await signinController(mockRequest as Request, mockResponse as Response);

    expect(BAD_REQUEST_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
      undefined,
      'The userName or password is invalid',
    );
  });

  test('should handle user not found', async () => {
    mockGetByUsername.mockResolvedValue({
      Count: 0,
    });

    mockRequest.body = { username: 'nonExistentUser', password: 'password' };

    await signinController(mockRequest as Request, mockResponse as Response);

    expect(NOT_FOUND_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
      'User not founded',
    );
  });
});
