import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import ClassDynamoService from './ClassDynamoService';

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
describe('ClassDynamoService', () => {
  let classDynamoService: ClassDynamoService;
  const dynamoInstance = DynamoDBSingleton.getInstance();
  beforeEach(() => {
    jest.clearAllMocks();
    classDynamoService = new ClassDynamoService(dynamoInstance);
  });

  test('updateClass should handle successful update', async () => {
    const result = await classDynamoService.updateClass({
      id: 'mockedId',
      body: {
        title: 'Mocked Title',
        description: 'Mocked Description',
        classDate: '2022-02-09T12:00:00.000Z',
      },
      teacherId: 'mockedTeacherId',
    });

    expect(dynamoInstance.update).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  test('createClass should handle successful creation', async () => {
    const result = await classDynamoService.createClass({
      PK: 'mockedPK',
      SK: 'mockedSK',
      Username: 'mockedUsername',
      Description: 'Mocked Description',
      ClassDate: '2022-02-09T12:00:00.000Z',
      ClassTitle: 'Mocked Title',
    });

    expect(dynamoInstance.put).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  test('getClassById should handle successful retrieval', async () => {
    const result = await classDynamoService.getClassById('mockedPK');

    expect(dynamoInstance.query).toHaveBeenCalled();
    expect(result).toEqual({
      Items: [{ mockItem: 'data' }],
    });
  });
});
