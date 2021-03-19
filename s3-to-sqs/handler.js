'use strict';

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

const SQS_URL = "https://sqs.us-east-1.amazonaws.com/858738807917/dataQueue";

module.exports.file_handler = async (event, context) => {

    await Promise.all(event.Records.map(async (record) => {
     try {
     const params = {
          Bucket: record.s3.bucket.name,
          Key: record.s3.object.key
      };

      var data = await s3.getObject(params).promise();

      await sqs.sendMessage({
          MessageBody: data.Body.toString('utf-8'),
          QueueUrl: SQS_URL,
      }).promise();

    } catch(err) {
        console.log(err);
    }

   }));
};
