// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.TAGS_TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const common = require('../../common/common');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getTopTags only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        const params = {
            TableName: tableName
        };
        const data = await docClient.scan(params).promise();

        let results = [];
        let counter = 0;
        data.Items.sort((a, b) => a.id - b.id);
        for (const item of data.Items) {
            if(counter < 5){
                results.push(item);
                counter++;
            }
        }

        return common.getAPIResponseObj(event, results, "Get top tags success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}
