// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.HOTELS_TABLE_NAME;
const userstableName = process.env.USERS_TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const common = require('../../common/common');

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const lambda = new LambdaClient({ region: 'ca-central-1' });

// const AWS = require('aws-sdk');
// // Configure the AWS SDK with your credentials and region
// AWS.config.update({region: 'ca-central-1'});
// // Create an instance of the Lambda service
// const lambda = new AWS.Lambda();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getTopHotels only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        // Get URL parameters from the event object
        const queryParams = event.queryStringParameters;
        
        // Extract specific parameters
        let _description = queryParams.description;
        let _location = queryParams.location;
        const _email = queryParams.email;

        let userObject;
        if (_description === "") {
            if(_location === ""){
                _location = "Galle";
            }
            const getparams = {
                TableName: userstableName,
                FilterExpression: 'email = :this_user',
                ExpressionAttributeValues: { ':this_user': _email }
            };
            results = await docClient.scan(getparams).promise();
            userObject = results.Items[0];
            console.log("UserObject");
            console.log(userObject);
            _description = userObject.preferences.join(" ");
        }

        // Define parameters for the function you want to invoke
        const params = {
            FunctionName: 'recommendHotels',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ description: _description, location: _location})
        };

        console.log("Invoking...");
        try {
            const data = await lambda.send(new InvokeCommand(params));
            console.log("Invocation successful");
            // Do something with the response if needed
            const byteArray = Buffer.from(data.Payload); // Example byte array
            const jsonString = byteArray.toString('utf8'); // Convert byte array to string
            const jsonObject = JSON.parse(jsonString);
            console.log(jsonObject);
            return common.getAPIResponseObj(event, jsonObject.body, "Top hotel recommendations get successful", 200);
          } catch (err) {
            console.error(err);
          }
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}