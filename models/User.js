const mongoose = require("mongoose");
//const Schema = mongoose.Schema; /equivalent below
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
});

//creates new userSchema and loaded it into mongoose
mongoose.model("users", userSchema);
