'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');


AWS.config.update({region: 'us-east-1'});

const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

module.exports.get_users = (event, context, callback) => {
    dynamoDb.scan({ TableName: process.env.TABLE_NAME }, (err, data) => {
        if (err) callback(err);

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                data: data.Items
            })
        });
    });
};

module.exports.get_user = (event, context, callback) => {
    dynamoDb.getItem({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: event.pathParameters.id } },
     }, (err, data) => {
        if (err) callback(err);

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                data: data.Item
            })
        });
    });
};


module.exports.create_user = (event, context, callback) => {
    dynamoDb.putItem({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: { S: uuidv4() },
          data: { S: event.body },
        }
    }, (err, data) => {
        if (err) callback(err);

        return callback(null, {
            statusCode: 200,
            body: "ok"
        });
    });
};

module.exports.delete_user = (event, context, callback) => {
    dynamoDb.deleteItem({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: event.pathParameters.id  }
        }
    }, (err, data) => {
        if (err) callback(err);

        return callback(null, {
            statusCode: 200,
            body: "ok"
        });
    });
};
