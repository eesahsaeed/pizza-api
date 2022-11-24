
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = function(request){
  if (!request.deliveryId || !request.status)
    throw new Error("Status and delivery ID are required");

  return docClient.update({
    TableName: "pizza-orders",
    Key: {
      orderId: request.deliveryId
    },
    AttributeUpdates: {
      orderStatus: {
        Action: "PUT",
        Value: request.status
      }
    }
  }).promise()
  .then(() => {
    return {}
  });
}
