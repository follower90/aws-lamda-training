'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { responseSuccess } = require('./utils');

AWS.config.update({ region: 'us-east-1' });

const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const tableParams = { TableName: process.env.TABLE_NAME };

const get_users = async (event, context, callback) => {
    try {
        const data = await dynamoDb.scan({ ...tableParams }).promise();
        callback(null, responseSuccess({ data: data.Items.map(AWS.DynamoDB.Converter.unmarshall) }));
    } catch (err) {
        callback(err);
    }
};

const get_user = async (event, context, callback) => {
    try {
        const data = await dynamoDb.getItem({
            ...tableParams,
            Key: { id: { S: event.pathParameters.id } }
        }).promise();
        callback(null, responseSuccess({ data: AWS.DynamoDB.Converter.unmarshall(data.Item) }));
    } catch (err) {
        callback(err);
    }
};

const create_user = async (event, context, callback) => {
    try {
        await dynamoDb.putItem({
            ...tableParams,
            Item: { id: { S: uuidv4() }, data: { S: event.body } }
        }).promise();
        callback(null, responseSuccess("ok"));
    } catch (err) {
        callback(err);
    }
};

const delete_user = async (event, context, callback) => {
    try {
        await dynamoDb.deleteItem({
            ...tableParams,
            Key: { id: { S: event.pathParameters.id } }
        }).promise();
        callback(null, responseSuccess("ok"));
    } catch (err) {
        callback(err);
    }
};


module.exports = {
    get_user,
    get_users,
    create_user,
    delete_user,
};
