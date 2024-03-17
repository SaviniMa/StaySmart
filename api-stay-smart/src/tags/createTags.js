// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TAGS_TABLE_NAME;
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        // Get id and name from the body of the request
        const tags = JSON.parse(event.body);

        if (tags.length === 0) {
            throw new Error(`Please enter at least one tag`);
        }

        for (const [index, item] of tags.entries()) {
            const payload = {
                id: index.toString(),
                tag: item,
              }
            const params = {
                TableName: tableName,
                Item: payload
            };
            const result = await docClient.put(params).promise();
        }

        return common.getAPIResponseObj(event, tags.length, "Tags creation success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};