import { useDatabase } from '../src/database';

// Mocking the methods of the DynamoDB client
const mockedGetItem = jest.fn();
const mockedPutItem = jest.fn();
const mockedUpdateItem = jest.fn();
const mockedDeleteItem = jest.fn();
const mockedQuery = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDB: jest.fn().mockImplementation(() => {
      return {
        getItem: mockedGetItem,
        putItem: mockedPutItem,
        updateItem: mockedUpdateItem,
        deleteItem: mockedDeleteItem,
        query: mockedQuery,
      };
    }),
  };
});

describe('useDatabase', () => {
  beforeEach(() => {
    // Resetting the mocked functions
    mockedGetItem.mockResolvedValue({} as never);
    mockedPutItem.mockResolvedValue({} as never);
    mockedUpdateItem.mockResolvedValue({} as never);
    mockedDeleteItem.mockResolvedValue({} as never);
    mockedQuery.mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('finds an item', async () => {
    const { find } = useDatabase('testTable');

    await find('entityTypeTest', 'idTest');

    expect(mockedGetItem).toHaveBeenCalledWith({
      TableName: 'testTable',
      Key: {
        pk: { S: 'entityTypeTest#idTest' },
        sk: { S: 'entityTypeTest#idTest' },
      },
    });
  });

  it('saves an item', async () => {
    const { save } = useDatabase('testTable');
    const testData = { name: 'John' };

    await save('entityTypeTest', 'idTest', testData);

    expect(mockedPutItem).toHaveBeenCalledWith({
      TableName: 'testTable',
      Item: {
        pk: { S: 'entityTypeTest#idTest' },
        sk: { S: 'entityTypeTest#idTest' },
        name: { S: 'John' },
      },
    });
  });

  it('updates an item', async () => {
    const { update } = useDatabase('testTable');
    const updateData = { name: 'Jane' };

    await update('entityTypeTest', 'idTest', updateData);

    expect(mockedUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'testTable',
        Key: {
          pk: { S: 'entityTypeTest#idTest' },
          sk: { S: 'entityTypeTest#idTest' },
        },
        UpdateExpression: expect.any(String),
        ExpressionAttributeNames: expect.any(Object),
        ExpressionAttributeValues: expect.any(Object),
      })
    );
  });

  it('soft deletes an item', async () => {
    const { softDelete } = useDatabase('testTable');

    await softDelete('entityTypeTest', 'idTest');

    expect(mockedUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'testTable',
        Key: {
          pk: { S: 'entityTypeTest#idTest' },
          sk: { S: 'entityTypeTest#idTest' },
        },
        UpdateExpression: 'SET deletedAt = :now',
      })
    );
  });

  it('deletes an item', async () => {
    const { delete: del } = useDatabase('testTable');

    await del('entityTypeTest', 'idTest');

    expect(mockedDeleteItem).toHaveBeenCalledWith({
      TableName: 'testTable',
      Key: {
        pk: { S: 'entityTypeTest#idTest' },
        sk: { S: 'entityTypeTest#idTest' },
      },
    });
  });

  it('queries an item with conditions', async () => {
    const { query } = useDatabase('testTable');

    await query('entityTypeTest', 'idTest')
      .filterBy('name', 'EQ', 'John')
      .exec();

    expect(mockedQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'testTable',
        KeyConditionExpression: expect.any(String),
        FilterExpression: expect.stringContaining(
          'AND attribute_not_exists(deletedAt)'
        ),
      })
    );
  });
});
