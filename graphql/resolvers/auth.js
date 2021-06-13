const bcrypt = require("bcryptjs");

const User = require("../../models/User");


module.exports = {
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
