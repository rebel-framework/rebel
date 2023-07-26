import { GetItemCommandInput, AttributeValue } from '@aws-sdk/client-dynamodb';
import { createClient } from './database/client';

type QueryCondition = {
  field: string;
  operator: 'EQ' | 'LT' | 'LTE' | 'GT' | 'GTE' | 'BEGINS_WITH' | 'BETWEEN';
  value: any;
};

export const createDatabase = (tableName: string) => {
  const { client } = createClient();

  const key = (type: string, id: string | number) => `${type}#${id}`;

  const find = async (entityType: string, id: string | number) => {
    const params: GetItemCommandInput = {
      TableName: tableName,
      Key: {
        pk: { S: key(entityType, id) },
        sk: { S: key(entityType, id) },
      },
    };

    const { Item } = await client.getItem(params);
    return Item;
  };

  const save = async <T>(entityType: string, id: string | number, item: T) => {
    const params = {
      TableName: tableName,
      Item: {
        pk: { S: key(entityType, id) },
        sk: { S: key(entityType, id) },
        ...Object.entries(item).reduce((acc, [k, v]) => {
          acc[k] = { S: String(v) };
          return acc;
        }, {} as Record<string, AttributeValue>),
      },
    };

    await client.putItem(params);
  };

  const update = async <T>(
    entityType: string,
    id: string | number,
    updateExpression: T
  ) => {
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    let updateExpr = 'SET ';

    // Loop over the updateExpression object to build the update expression for DynamoDB
    Object.keys(updateExpression).forEach((key, index) => {
      // DynamoDB does not allow us to use JavaScript reserved words as attribute names,
      // so we use this '#attr' syntax to avoid errors if reserved words are used.
      // We also need to handle the comma to separate the fields correctly.
      updateExpr += `${index > 0 ? ', ' : ''}#attr${index} = :val${index}`;
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = {
        S: updateExpression[key],
      };
    });

    const params = {
      TableName: tableName,
      Key: {
        pk: { S: key(entityType, id) },
        sk: { S: key(entityType, id) },
      },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW', // Returns all of the attributes of the item, as they appear after the UpdateItem operation.
    };

    await client.updateItem(params);
  };

  const softDelete = async (entityType: string, id: string | number) => {
    // Instead of deleting the item, we update the deletedAt attribute to the current timestamp.
    const params = {
      TableName: tableName,
      Key: {
        pk: { S: key(entityType, id) },
        sk: { S: key(entityType, id) },
      },
      UpdateExpression: 'SET deletedAt = :now',
      ExpressionAttributeValues: {
        ':now': { S: new Date().toISOString() },
      },
    };

    await client.updateItem(params);
  };

  const del = async (entityType: string, id: string | number) => {
    const params = {
      TableName: tableName,
      Key: {
        pk: { S: key(entityType, id) },
        sk: { S: key(entityType, id) },
      },
    };

    await client.deleteItem(params);
  };

  const query = (entityType: string, id: string) => {
    const conditions: QueryCondition[] = [];

    return {
      filterBy: (
        field: string,
        operator: QueryCondition['operator'],
        value: any
      ) => {
        conditions.push({ field, operator, value });
        return query(entityType, id);
      },
      exec: async () => {
        const params = {
          TableName: tableName,
          KeyConditionExpression: 'pk = :pk AND sk = :sk',
          ExpressionAttributeValues: {
            ':pk': { S: `${entityType}#${id}` },
            ':sk': { S: `${entityType}#${id}` },
            ...conditions.reduce((acc, c) => {
              acc[`:${c.field}`] = { S: c.value };
              return acc;
            }, {} as Record<string, AttributeValue>),
          },
          FilterExpression: conditions
            .map((_, i) => `#${_.field} ${_.operator} :${_.field}`)
            .join(' AND '),
          ExpressionAttributeNames: conditions.reduce((names, condition) => {
            names[`#${condition.field}`] = condition.field;
            return names;
          }, {} as Record<string, string>),
        };

        // TODO: Use config to add check?
        // Add a condition to only return items that are not deleted.
        params.FilterExpression += ` AND attribute_not_exists(deletedAt)`;

        return client.query(params);
      },
    };
  };

  return { find, save, update, softDelete, delete: del, query };
};
