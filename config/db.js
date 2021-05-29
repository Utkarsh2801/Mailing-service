const mongoose = require("mongoose");

exports.dbConnect = () => {
  mongoose.connect(
    process.env.MONGODB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
      console.log("Database connect");
    }
  );
};
