
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");
const {v4} = require("uuid");

function createOrder(request){
  console.log('Save an order', request)
  const userData = request.context.authorizer.claims;
  console.log("User data", userData);

  let userAddress = request.body && request.body.address;
  if (!userAddress){
    userAddress = JSON.parse(userData.address).formatted;
  }

  if (!request.body || !request.body.pizza || !request.body.address){
    throw new Error("To order pizza please provide pizza type and address where pizza should be delivered");
  }

  return rp.post('https://some-like-it-hot.effortless-serverless.com/delivery', {
    headers: {
      "Authorization": "aunt-marias-pizzeria-1234567890",
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      pickupTime: "15.34pm",
      pickupAddress: "Aunt Maria Pizzeria",
      deliveryAddress: userAddress,
      webhookUrl: "https://22owyoxktk.execute-api.us-east-1.amazonaws.com/latest/delivery"
    })
  })
  .then(rawResponse => JSON.parse(rawResponse.body))
  .then(response => {
    return docClient.put({
      TableName: "pizza-orders",
      Item: {
        cognitoUsername: userAddress['cognito:username'],
        orderId: response.deliveryId,
        pizza: request.body.pizza,
        address: request.body.address,
        orderStatus: "pending"
      }
    }).promise()
    .then(res => {
      console.log("Order is saved!", res);
      return res;
    })
    .catch(saveError => {
      console.log(saveError);
      throw saveError;
    })
  })
}

module.exports = createOrder;
