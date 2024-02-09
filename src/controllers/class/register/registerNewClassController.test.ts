import { Request, Response } from 'express';
import { classInstance } from 'src/services/class/dynamo';
import { tokenInstance } from 'src/services/teacher/auth';
import {
  CREATED_HTTP_RESPONSE,
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
} from 'src/utils/http';
import { v4 as uuidv4 } from 'uuid';
import registerNewClassController from './registerNewClassController';
import { JwtPayload } from 'jsonwebtoken';

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
  const mockUuidv4 = uuidv4 as jest.Mock;
  const mockVerify = tokenInstance.verify as jest.Mock;
  const mockCreateClass = classInstance.createClass as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {
        title: 'Mocked Title',
        description: 'Mocked Description',
        classDate: '2022-02-09T12:00:00.000Z',
      },
      headers: {
        authorization: 'Bearer mockToken',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUuidv4.mockReturnValue('mockedClassId');
  });

  test('should handle successful class registration', async () => {
    const mockedPayload: JwtPayload = {
      id: 'mockedUserId',
      userName: 'mockedUserName',
    };
    mockVerify.mockReturnValue({ payload: mockedPayload });

    mockCreateClass.mockResolvedValue(undefined);

    await registerNewClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(CREATED_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      title: 'Mocked Title',
      description: 'Mocked Description',
      classDate: '2022-02-09T12:00:00.000Z',
      id: 'mockedClassId',
    });
  });

  test('should handle token validation failure', async () => {
    mockVerify.mockImplementation(() => {
      throw new Error('Token validation failed');
    });

    await registerNewClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });

  test('should handle class registration failure', async () => {
    const mockedPayload: JwtPayload = {
      id: 'mockedUserId',
      userName: 'mockedUserName',
    };
    mockVerify.mockReturnValue({ payload: mockedPayload });

    const error = new Error('Class registration failed');
    mockCreateClass.mockRejectedValue(error);

    await registerNewClassController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });
});
