// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;
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
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill the required fields: id, hotelName, city`);
        }

        // record to update the current product details
        const payload = {
            id: body.id.toString(),
            hotelName: body.hotelName,
            city: body.city,
            predicted_proba: body.predicted_proba
          }
        const params = {
            TableName: tableName,
            Item: payload
        };
        const result = await docClient.put(params).promise();

        return common.getAPIResponseObj(event, payload, "Chart record creation success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function _validateBody(body) {
    let isValid = true;
    if (body.id === undefined || body.id === "") {
        isValid = false;
    } else if (body.hotelName === undefined || body.hotelName === "") {
        isValid = false;
    } else if (body.city === undefined || body.city === "") {
        isValid = false;
    } else if (body.predicted_proba === undefined || body.predicted_proba === "") {
        isValid = false;
    } 
    return isValid;
}