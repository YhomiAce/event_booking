const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphqlSchema =  require("./graphql/schema/index");
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require("./middleware/isAuth");



const app = express();

app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})
app.use(isAuth);

app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: graphqlSchema ,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect("mongodb://localhost/graphQl_app")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, console.log("Server Started on port: 5000"));
