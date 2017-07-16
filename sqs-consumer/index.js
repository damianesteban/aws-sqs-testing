const express = require('express');
const app = express();
const aws = require('aws-sdk');
const uuid = requitr('node-uuid');
const queueUrl = "https://sqs.us-east-1.amazonaws.com/330377842965/starter-queue";

// Load the AWS credentials
aws.config.loadFromPath(__dirname + '/config.json');

const sqs = new aws.SQS();

function receive(cb) {
    var params = {
        QueueUrl: queueUrl,
	    MaxNumberOfMessages: 1,
        VisibilityTimeout: 120,
	    WaitTimeSeconds: 10
    };

     sqs.receiveMessage(params, function(err, data) {
        if(err) {
            cb(err);
        }
        else {
            if (data.Messages === undefined) {
                cb(null, null);
            } else {
                cb(null, data.Messages[0]);
            }
        }
    });
}

function process(message, cb) {
    const body = JSON.parse(message.Body);
    console.log(`Message body: ${body}`)
}

function acknowledge(message, cb) {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle
    };

    sqs.deleteMessage(params, cb);
}

function run() {
    receive((err, message) => {
        if (err) {
            throw err;
        } else {
            if (message === null) {
                console.log('nothing to process...');
                setTimeout(run, 1000);
            } else {
                console.log('Processing...')
                process(message, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        acknowledge(message, (err) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log('Finished processing.')
                                setTimeout(run, 1000);
                            }
                        })
                    }
                })
            }
        }
    })
}

run();