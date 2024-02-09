import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TEACHER_STATUS } from 'src/utils/constants';
import signupController from './signupController';
import teacherInstance from 'src/services/teacher/dynamo';
jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/dynamo');
jest.mock('src/infra/dynamo/DynamoSingleton');

describe('signupController', () => {
  const mockedHash = 'mockedId';
  const mockGetByUsername = teacherInstance.getByUsername as jest.Mock;
  const mockCreateTeacher = teacherInstance.createTeacher as jest.Mock;
  const mockUuidv4 = uuidv4 as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle successful teacher registration', async () => {
    const mockRequest: Partial<Request> = {
      body: { username: 'testUser', password: 'testPassword' },
    };

    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockGetByUsername.mockResolvedValue({ Count: 0 });
    mockUuidv4.mockReturnValue(mockedHash);
    mockCreateTeacher.mockResolvedValue(undefined);

    await signupController(mockRequest as Request, mockResponse as Response);

    expect(mockGetByUsername).toHaveBeenCalledWith(
      'testUser',
      'CUSTOMER#TEACHER',
    );
    expect(mockUuidv4).toHaveBeenCalled();
    expect(mockCreateTeacher).toHaveBeenCalledWith({
      Username: 'testUser',
      Password: mockedHash,
      Status: TEACHER_STATUS.PENDING,
      SK: 'CUSTOMER#TEACHER',
      PK: 'mockedId',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: {
        id: 'mockedId',
      },
      message: '',
      ok: true,
    });
  });

  test('should handle bad request when already exists a teacher', async () => {
    const mockRequest: Partial<Request> = {
      body: { username: 'testUser', password: 'testPassword' },
    };

    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockGetByUsername.mockResolvedValue({ Count: 1 });

    await signupController(mockRequest as Request, mockResponse as Response);

    expect(mockGetByUsername).toHaveBeenCalledWith(
      'testUser',
      'CUSTOMER#TEACHER',
    );
    expect(mockCreateTeacher).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User already exists',
      ok: false,
    });
  });

  test('should handle internal server error when trigger excepetion', async () => {
    const mockRequest: Partial<Request> = {
      body: { username: 'testUser', password: 'testPassword' },
    };

    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockGetByUsername.mockRejectedValue(new Error('error'));

    await signupController(mockRequest as Request, mockResponse as Response);

    expect(mockGetByUsername).toHaveBeenCalledWith(
      'testUser',
      'CUSTOMER#TEACHER',
    );
    expect(mockCreateTeacher).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      ok: false,
    });
  });
});
