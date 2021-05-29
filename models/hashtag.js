const mongoose = require("mongoose");

const hashTagSchema = new mongoose.Schema({
  hashtag: {
    type: String,
    required: true,
  },
  postId: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  follower: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hashtag = mongoose.model("Hashtag", hashTagSchema);

module.exports = Hashtag;
