import { Request, Response } from 'express';
import { classInstance } from 'src/services/class/dynamo';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NOT_FOUND_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import updateClassController from './updateClassController';

jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/auth');
jest.mock('src/utils/http');
jest.mock('src/infra/dynamo/DynamoSingleton');
jest.mock('src/services/class/dynamo');

describe('registerNewClassController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockUpdateClass = classInstance.updateClass as jest.Mock;
  const mockGetClassById = classInstance.getClassById as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {},
      params: { classId: 'mockedClassId' },
      headers: { teacherId: 'mockedTeacherId' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should handle successful class update', async () => {
    const mockedClass = {
      ClassTitle: 'A Title',
      Description: 'A Description',
    };

    mockGetClassById.mockResolvedValue({
      Items: [mockedClass],
    });

    mockUpdateClass.mockResolvedValue(undefined);

    await updateClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(SUCCESS_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      id: 'mockedClassId',
    });
  });

  test('should handle class not found', async () => {
    mockGetClassById.mockResolvedValue({
      Items: [],
    });

    await updateClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(NOT_FOUND_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
      'Class not founded',
    );
  });

  test('should handle internal server error', async () => {
    mockGetClassById.mockRejectedValue(new Error('Some error'));

    await updateClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });
});
