const express = require('express');
const app = express();
const aws = require('aws-sdk');
const uuid = requitr('node-uuid');
const queueUrl = "______________________";
const receipt = "";

// Load the AWS credentials 
aws.config.loadFromPath(__dirname + '/config.json');
const sqs = new aws.SQS();

const id = uuid.v4();

const body = {
    "id": id,
    "url": "http://www.google.com/article.html"
}

const params = {
    MessageBody: 'folios_updated',
    QueueUrl: queueUrl
}

const send = (params) => {
    return new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                console.log(`Sent message with id: ${id}`);
                resolve(data)
            }
        })
    })
}
// Sends a message to the queue
app.get('/send', function (req, res) {
    send(params)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send(err)
        })
});

app.listen(3000, () => console.log('Server running on port 3000'));