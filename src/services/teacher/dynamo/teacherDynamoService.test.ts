import TeacherDynamoService from './TeacherDynamoService';
import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';

jest.mock('src/infra/dynamo/DynamoSingleton');
const mockDynamoDBDocumentClient = {
  put: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
  update: jest
    .fn()
    .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
  query: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Items: [{ mockItem: 'data' }],
    }),
  }),
};

(DynamoDBSingleton.getInstance as jest.Mock).mockReturnValue(
  mockDynamoDBDocumentClient,
);
describe('TeacherDynamoService', () => {
  let teacherDynamoService: TeacherDynamoService;
  const dynamoInstance = DynamoDBSingleton.getInstance();
  const mockPut = dynamoInstance.put as jest.Mock;
  const mockUpdate = dynamoInstance.update as jest.Mock;
  const mockQuery = dynamoInstance.query as jest.Mock;

  beforeEach(() => {
    teacherDynamoService = new TeacherDynamoService(dynamoInstance);
  });

  describe('createTeacher', () => {
    it('should create a teacher', async () => {
      const mockValueParams = {
        Username: 'testUser',
        Password: 'hashedPassword',
        Status: 'PENDING',
      };

      mockPut.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Count: 1 }),
      });

      const result = await teacherDynamoService.createTeacher(mockValueParams);

      expect(result).toBeDefined();
      expect(mockPut).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Item: mockValueParams,
        ReturnValues: 'ALL_OLD',
      });
    });
  });

  describe('getByUsername', () => {
    it('should get teacher by username without password', async () => {
      const mockUsername = 'testUser';
      const mockSK = 'CUSTOMER#TEACHER';
      const mockGetPass = false;

      mockQuery.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ pk: 'aksdld12' }),
      });

      const result = await teacherDynamoService.getByUsername(
        mockUsername,
        mockSK,
        mockGetPass,
      );

      expect(result).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith({
        TableName: expect.any(String),
        IndexName: 'GSI-Username',
        KeyConditionExpression: 'SK = :SK AND Username = :username',
        ExpressionAttributeValues: {
          ':username': mockUsername,
          ':SK': mockSK,
        },
        ProjectionExpression: 'SK,PK,Username,#status',
        ExpressionAttributeNames: {
          '#status': 'Status',
        },
      });
    });

    it('should get teacher by username with password', async () => {
      const mockUsername = 'testUser';
      const mockSK = 'CUSTOMER#TEACHER';
      const mockGetPass = true;

      mockQuery.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ PK: 'asndasn1212' }),
      });

      const result = await teacherDynamoService.getByUsername(
        mockUsername,
        mockSK,
        mockGetPass,
      );

      expect(result).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith({
        TableName: expect.any(String),
        IndexName: 'GSI-Username',
        KeyConditionExpression: 'SK = :SK AND Username = :username',
        ExpressionAttributeValues: {
          ':username': mockUsername,
          ':SK': mockSK,
        },
      });
    });
  });

  describe('getById', () => {
    it('should get teacher by ID without password', async () => {
      const mockId = '123';
      const mockSK = 'CUSTOMER#TEACHER';
      const mockGetPass = false;

      mockQuery.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ username: 'douglas' }),
      });

      const result = await teacherDynamoService.getById(
        mockId,
        mockSK,
        mockGetPass,
      );

      expect(result).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith({
        TableName: expect.any(String),
        KeyConditionExpression: 'SK = :SK AND PK = :id',
        ExpressionAttributeValues: {
          ':id': mockId,
          ':SK': mockSK,
        },
        ProjectionExpression: 'SK,PK,Username,#status',
        ExpressionAttributeNames: {
          '#status': 'Status',
        },
      });
    });

    it('should get teacher by ID with password', async () => {
      const mockId = '123';
      const mockSK = 'CUSTOMER#TEACHER';
      const mockGetPass = true;

      mockQuery.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ data: true }),
      });

      const result = await teacherDynamoService.getById(
        mockId,
        mockSK,
        mockGetPass,
      );

      expect(result).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith({
        TableName: expect.any(String),
        KeyConditionExpression: 'SK = :SK AND PK = :id',
        ExpressionAttributeValues: {
          ':id': mockId,
          ':SK': mockSK,
        },
      });
    });
  });
  describe('approveTeacherStatus', () => {
    it('should approve teacher status', async () => {
      const mockId = '123';

      mockUpdate.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Count: 1 }),
      });

      const result = await teacherDynamoService.approveTeacherStatus(mockId);

      expect(result).toBeDefined();
      expect(mockUpdate).toHaveBeenCalledWith({
        TableName: expect.any(String),
        AttributeUpdates: {
          Status: { Action: 'PUT', Value: 'APPROVED' },
          ApprovedDate: { Action: 'PUT', Value: expect.any(String) },
        },
        Key: { PK: mockId, SK: 'CUSTOMER#TEACHER' },
      });
    });
  });

  describe('getClassesById', () => {
    it('should get classes by ID', async () => {
      const mockSK = 'testSK';

      mockQuery.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ id: '123123' }),
      });

      const result = await teacherDynamoService.getClassesById(mockSK);

      expect(result).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith({
        TableName: expect.any(String),
        IndexName: 'GSI-SK',
        KeyConditionExpression: 'SK = :SK',
        ExpressionAttributeValues: {
          ':SK': mockSK,
        },
      });
    });
  });
});
