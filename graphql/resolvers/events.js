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
    createEvent: async (args, req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated!');
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:req.userId,
      });
      let createdEvent;
  
      try {
        const result = await event.save();
        createdEvent = transaformedEvent(result);
        const creator = await User.findById(req.userId);
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