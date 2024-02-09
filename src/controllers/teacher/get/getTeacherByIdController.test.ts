import { Request, Response } from 'express';
import teacherInstance from 'src/services/teacher/dynamo';
import {
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
import getTeacherByIdController from './getTeacherByIdController';

jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/dynamo');
jest.mock('src/services/teacher/auth');
jest.mock('src/utils/http');
jest.mock('src/infra/dynamo/DynamoSingleton');

describe('getTeacherByIdController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockGetByUsername = teacherInstance.getByUsername as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      params: { userName: 'mockedUserName' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should handle successful retrieval of teacher', async () => {
    const mockedTeacher = {
      PK: 'mockedId',
      Username: 'mockedUserName',
    };

    mockGetByUsername.mockResolvedValue({
      Items: [mockedTeacher],
    });

    await getTeacherByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(CREATED_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      teacher: mockedTeacher,
    });
  });

  test('should handle teacher not found', async () => {
    mockGetByUsername.mockResolvedValue({
      Items: [],
    });

    await getTeacherByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(CREATED_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      teacher: undefined,
    });
  });

  test('should handle internal server error', async () => {
    mockGetByUsername.mockRejectedValue(new Error('Some error'));

    await getTeacherByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });
});
