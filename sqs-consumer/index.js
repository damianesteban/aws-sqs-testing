const aws = require('aws-sdk');
const Consumer = require('sqs-consumer');
const queueUrl = "";

// Load the AWS credentials
aws.config.loadFromPath(__dirname + '/config.json');

const sqs = new aws.SQS();

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/330377842965/starter-queue',
    handleMessage: (message, done) => {
        console.log(message.Body);
        done();
    },
    sqs: new AQS.SQS()
})

app.on('error', (err) => {
    console.log(`Error: ${err.message}`)
})

app.start();