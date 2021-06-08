const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const Event = require("./models/Event");
const User  = require("./models/User");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!,
            title: String!
            description: String!
            price: Float
            date: String!
        }

        type User {
            _id: ID!,
            name: String!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            name: String!
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event !]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
         
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            console.log(events);
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        // };
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '60bf9773fe9190247cc337ec'
        });
        let createdEvent;

        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc };
            console.log(result);
             return User.findById("60bf9773fe9190247cc337ec")                       
          })
          .then(user =>{
            if (!user) {
                throw new Error('User does not exists')
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result =>{
            return createdEvent;;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
          return User.findOne({email: args.userInput.email}).then(user =>{
              if (user) {
                  throw new Error('User exists already')
              }
              return bcrypt.hash(args.userInput.password,12)
          })
         .then(hashPwd =>{
            const user = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashPwd
    
            });
            return user.save().then(result =>{
                return {...result._doc};
            })
          }).catch(err=>{
              throw err;
          })
        
      }
    },
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
