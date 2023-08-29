const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  position: String,
  birth: Date,
  userId: String,
});

const ArtistModel = mongoose.model("artists", ArtistSchema);

module.exports = ArtistModel;
