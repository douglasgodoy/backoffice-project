import { Request, Response } from 'express';
import teacherInstance from 'src/services/teacher/dynamo';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import updateStatusController from './updateStatusController';

jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/dynamo');
jest.mock('src/services/teacher/auth');
jest.mock('src/utils/http');
jest.mock('src/infra/dynamo/DynamoSingleton');

describe('updateStatusController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockGetById = teacherInstance.getById as jest.Mock;
  const mockApproveTeacherStatus =
    teacherInstance.approveTeacherStatus as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: { id: 'mockedId' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should handle successful status update', async () => {
    const mockedTeacher = {
      PK: 'mockedId',
    };

    mockGetById.mockResolvedValue({
      Count: 1,
      Items: [mockedTeacher],
    });

    mockApproveTeacherStatus.mockResolvedValue(undefined);

    await updateStatusController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(SUCCESS_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      id: 'mockedId',
    });
  });

  test('should handle teacher not found', async () => {
    mockGetById.mockResolvedValue({
      Count: 0,
    });

    await updateStatusController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(NOT_FOUND_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
      'User not founded',
    );
  });

  test('should handle internal server error', async () => {
    mockGetById.mockRejectedValue(new Error('Some error'));

    await updateStatusController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });
});
