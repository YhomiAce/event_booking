const { transaformedEvent, transformedBooking } = require("./merge");
const Event = require("../../models/Event");
const Booking = require("../../models/Booking");


module.exports = {
  bookings: async (_) => {
    try {
      const bookings = await Booking.find();
      //   console.log(bookings);
      return bookings.map((book) => {
        return transformedBooking(book);
      });
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
      return transformedBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transaformedEvent(booking.event);
      console.log(booking.eventId);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
