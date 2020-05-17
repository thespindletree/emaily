const mongoose = require("mongoose");
//const Schema = mongoose.Schema; /equivalent below
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 },
});

//creates new userSchema and loaded it into mongoose
mongoose.model("users", userSchema);
