const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Event = require("../../models/Event");
const Booking = require("../../models/Booking");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event._doc.creator),
    };
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async (_) => {
    try {
      const bookings = await Booking.find();
    //   console.log(bookings);
      return bookings.map((book) => {
        return {
          ...book._doc,
          _id: book.id,
          user: user.bind(this, book._doc.user),
          event: singleEvent.bind(this, book._doc.event),
          createdAt: new Date(book._doc.createdAt).toISOString(),
          updatedAt: new Date(book._doc.updatedAt).toISOString(),
        };
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
      createdEvent = {
        ...result._doc,
        date: new Date(result._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
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
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "60c4d717f929630b082e0525",
        event: fetchedEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result._doc.id,
        user: user.bind(this, result._doc.user),
        event: singleEvent.bind(this, result._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator),
      };
      console.log(booking.eventId);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User exists already");
      }
      const hashPwd = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        name: args.userInput.name,
        email: args.userInput.email,
        password: hashPwd,
      });
      const result = await newUser.save();
      return { ...result._doc };
    } catch (err) {
      throw err;
    }
  },
};
