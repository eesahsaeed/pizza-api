
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const pizzas = require("../data/pizzas.json");

function getPizzas(pizzaId){
  if (!pizzaId)
    return pizzas;

  const pizza = pizzas.find(pizza => {
    return pizza.id == pizzaId;
  });

  if (pizza)
    return pizza;

  throw new Error("The pizza you requested was not found");
}

module.exports = getPizzas;
