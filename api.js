
const Api = require("claudia-api-builder");
const api = new Api();

const createOrder = require("./handlers/create-order");
const getOrders = require("./handlers/get-orders");
const updateDeliveryStatus = require("./handlers/update-delivery");

const getPizzas = require("./handlers/get-pizzas");
const getSignedUrl = require("./handlers/generate-presigned-url");

api.registerAuthorizer("userAuthentication", {
  providerARNs: ["arn:aws:cognito-idp:us-east-1:567106720048:userpool/us-east-1_7WhyITS7z"]
});

api.get("/", () => {
  return "Welcome to pizza API";
});

api.get("/pizzas", () => {
  return getPizzas();
});

api.get("/pizzas/{id}", (request) => {
  return getPizzas(request.pathParams.id);
}, {
  error: 404
});

api.get("/orders", () => {
  return getOrders();
}, {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

api.get("/orders/{id}", (request) => {
  return getOrders(request.pathParams.id);
}, {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

api.post("/orders", (request) => {
  return createOrder(request);
}, {
  success: 201,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

api.post("/delivery", request => {
  return updateDeliveryStatus(request.body);
}, {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

api.get("upload-url", request => {
  return getSignedUrl();
},
{
  error: 400,
  cognitoAuthorizer: "userAuthentication"
})

module.exports = api;
