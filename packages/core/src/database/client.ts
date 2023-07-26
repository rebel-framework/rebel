import { DynamoDB } from '@aws-sdk/client-dynamodb';

export const createClient = () => {
  const isTest = () => process.env.NODE_ENV === 'test';

  // TODO: Grab region from configuration
  const client = new DynamoDB({
    region: isTest() ? 'local' : 'eu-west-1',
  });

  return { client };
};
