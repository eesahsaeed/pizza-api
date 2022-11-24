
const {v4} = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

function generatePresignedUrl(){
  const params = {
    Bucket: "pizzaria-12345",
    Key: v4(),
    ACL: "public-read",
    Expires: 120
  }

  s3.getSignedUrl("putObject", params).promise()
  .then(url => {
    return {
      url: url
    }
  })
}

module.exports = generatePresignedUrl;
