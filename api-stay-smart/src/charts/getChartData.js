// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const chartsTableName = process.env.CHARTS_TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const common = require('../../common/common');


exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getTopHotels only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);
        
        const params = {
            TableName: chartsTableName
        };
        const data = await docClient.scan(params).promise();
        const results = {};

        const cities = ["galle", "colombo", "negombo", "kandy", "nuwara eliya"];
        for (const city of cities) {
            const recordsForCity = data.Items.filter(item => item.city === city);
            recordsForCity.sort((a, b) => b.predicted_proba - a.predicted_proba);
            const firstFiveItems = array.slice(0, 5);
            results[city] = firstFiveItems;
        }
        
        return common.getAPIResponseObj(event, results, "Chart data get successful", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}
