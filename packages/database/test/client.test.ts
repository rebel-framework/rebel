import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { useClient } from '../src/client';

jest.mock('@aws-sdk/client-dynamodb');

describe('useClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('uses local region when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    useClient();
    expect(DynamoDB).toHaveBeenCalledWith({
      region: 'local',
    });
  });

  it('uses eu-west-1 region for other environments', () => {
    process.env.NODE_ENV = 'production';
    useClient();
    expect(DynamoDB).toHaveBeenCalledWith({
      region: 'eu-west-1',
    });
  });
});
