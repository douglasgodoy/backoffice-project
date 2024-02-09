import { Request, Response } from 'express';
import teacherInstance from 'src/services/teacher/dynamo';
import {
  INTERNAL_SERVER_ERROR_HTTP_RESPONSE,
  NO_CONTENT_HTTP_RESPONSE,
  SUCCESS_HTTP_RESPONSE,
} from 'src/utils/http';
import getClassesByIdController, {
  adapterClass,
} from './getClassesByIdController';

jest.mock('uuid');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('mockedId'),
  genSalt: jest.fn().mockResolvedValue('3'),
}));

jest.mock('src/services/teacher/dynamo');
jest.mock('src/services/teacher/auth');
jest.mock('src/utils/http');
jest.mock('src/infra/dynamo/DynamoSingleton');
describe('getClassesByIdController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockGetClassesById = teacherInstance.getClassesById as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      params: { teacherId: 'mockedTeacherId' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should handle successful retrieval of classes', async () => {
    const mockedClasses = [
      {
        PK: 'mockedId1',
        ClassDate: '2022-02-09',
        ClassTitle: 'Mocked Class 1',
        Description: 'Description 1',
        Username: 'Teacher1',
      },
      {
        PK: 'mockedId2',
        ClassDate: '2022-02-10',
        ClassTitle: 'Mocked Class 2',
        Description: 'Description 2',
        Username: 'Teacher1',
      },
    ];

    mockGetClassesById.mockResolvedValue({
      Items: mockedClasses,
    });

    await getClassesByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(SUCCESS_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse, {
      classes: [
        {
          id: 'mockedId1',
          classDate: '2022-02-09',
          title: 'Mocked Class 1',
          description: 'Description 1',
          teacher: 'Teacher1',
        },
        {
          id: 'mockedId2',
          classDate: '2022-02-10',
          title: 'Mocked Class 2',
          description: 'Description 2',
          teacher: 'Teacher1',
        },
      ],
    });
  });

  test('should handle no classes found', async () => {
    mockGetClassesById.mockResolvedValue({
      Items: [],
    });

    await getClassesByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(NO_CONTENT_HTTP_RESPONSE).toHaveBeenCalledWith(mockResponse);
  });

  test('should handle internal server error', async () => {
    mockGetClassesById.mockRejectedValue(new Error('Some error'));

    await getClassesByIdController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(INTERNAL_SERVER_ERROR_HTTP_RESPONSE).toHaveBeenCalledWith(
      mockResponse,
    );
  });
});

describe('adapterClass', () => {
  test('should correctly adapt class data', () => {
    const mockedClasses = [
      {
        PK: 'mockedId',
        ClassDate: '2022-02-09',
        ClassTitle: 'Mocked Class',
        Description: 'Description',
        Username: 'Teacher1',
      },
    ];

    const adaptedClasses = adapterClass(mockedClasses);

    expect(adaptedClasses).toEqual([
      {
        id: 'mockedId',
        classDate: '2022-02-09',
        title: 'Mocked Class',
        description: 'Description',
        teacher: 'Teacher1',
      },
    ]);
  });
});
