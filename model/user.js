const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const hapiUserSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

hapiUserSchema.plugin(timeStamps);

const User = Mongoose.model("user", hapiUserSchema);

module.exports = User;