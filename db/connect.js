const mongoose = require("mongoose");

// const connectionString =process.env.MONGO_URL;

const connectDB = (url) => {
  return mongoose.connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
};

module.exports = connectDB;
