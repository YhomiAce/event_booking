const User = require("../../models/User");
const Event = require("../../models/Event");
const { dateToString } = require("../../helpers/date");

const transaformedEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformedBooking = (book) => {
    return {
      ...book._doc,
      _id: book.id,
      user: user.bind(this, book._doc.user),
      event: singleEvent.bind(this, book._doc.event),
      createdAt: dateToString(book._doc.createdAt),
      updatedAt: dateToString(book._doc.updatedAt),
    };
  };

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transaformedEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transaformedEvent(event);
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
  transformedBooking,
//   events,
  transaformedEvent,
};
