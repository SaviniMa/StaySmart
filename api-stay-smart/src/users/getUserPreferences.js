// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const passwordHash = require('password-hash');
const common = require('../../common/common');
var jwt = require('jsonwebtoken');

// Get the DynamoDB table name from environment variables
const tableName = process.env.USER_TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        // Get URL parameters from the event object
        const queryParams = event.queryStringParameters;
        const _email = queryParams.email;

        const getparams = {
            TableName: tableName,
            FilterExpression: 'email = :this_user',
            ExpressionAttributeValues: { ':this_user': _email }
        };
        const existingUser = await docClient.scan(getparams).promise();
        if (existingUser.Items !== undefined && existingUser.Items?.length == 0) {
            throw new Error(`There is no user registered for the given email address`);
        }
        const user = existingUser.Items[0];
        return common.getAPIResponseObj(event, user.preferences, "Get user preferences successfull", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};