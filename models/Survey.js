const mongoose = require("mongoose");
const { Schema } = mongoose;
const RecipientSchema = require("./Recipient");

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], // sub document collection - note this is an array
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: "User" }, // reference field to parent collection
  dateSent: Date,
  lastResponded: Date,
});

//creates new surveySchema and loaded it into mongoose
mongoose.model("surveys", surveySchema);
