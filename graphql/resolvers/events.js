const Event = require("../../models/Event");
const User = require("../../models/User");
const { transaformedEvent } = require('./merge')



module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map((event) => {
          return transaformedEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "60c4d717f929630b082e0525",
      });
      let createdEvent;
  
      try {
        const result = await event.save();
        createdEvent = transaformedEvent(result);
        const creator = await User.findById("60c4d717f929630b082e0525");
        if (!creator) {
          throw new Error("User does not exists");
        }
        creator.createdEvents.push(event);
        await creator.save();
  
        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
       
  };