// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const passwordHash = require('password-hash');
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const tableName = process.env.USER_TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'PUT') {
            throw new Error(`updateUser only accept PUT method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);
        const body = JSON.parse(event.body);

        const _email = body.email;
        const getUserParams = {
            TableName: tableName,
            FilterExpression: 'email = :this_user',
            ExpressionAttributeValues: { ':this_user': _email }
        };
        const existingUser = await docClient.scan(getUserParams).promise();
        if (existingUser.Items !== undefined && existingUser.Items?.length == 0) {
            throw new Error(`There is no user registered for the given email address`);
        }
        const user = existingUser.Items[0];

        user.preferences = body.preferences;

        const paramsUpdate = {
            TableName: tableName,
            Item: user
        };

        const result = await docClient.put(paramsUpdate).promise();

        return common.getAPIResponseObj(event, {}, "User update success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};