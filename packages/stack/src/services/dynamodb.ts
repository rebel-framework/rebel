import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';

export default function useDynamoDB(stack: CloudFormationStack) {
  const table = (tableName: string, tableProps: DynamoDB.TableProps) =>
    new DynamoDB.Table(stack, tableName, tableProps);

  return { table };
}
