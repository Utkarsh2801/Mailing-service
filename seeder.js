const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/user");
const Hashtag = require("./models/hashtag");

mongoose.connect("mongodb://localhost:27017/notificationdb", () => {
  console.log("Database connected");
});

const insertData = async function () {
  try {
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    await User.create(users);
    console.log("users created");
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async function () {
  try {
    await User.deleteMany({});
    await Hashtag.deleteMany({});
    console.log("data deleted");
  } catch (err) {
    console.log(err);
  }
};

let hashtags = [
  "#lostlove",
  "#loveincollege",
  "#feelin",
  "#schooldays",
  "#oldmemories",
];

const createHashtag = function () {
  hashtags.forEach(async (hashtag) => {
    await Hashtag.create({ hashtag });
  });

  console.log("Hashtags created");
};

const addUsersToHashtags = async function () {
  let users = await User.find({});
  let h1 = [];
  let h2 = [];
  let h3 = [];
  let h4 = [];
  let h5 = [];

  for (let i = 0; i < 400; i++) {
    h1.push(users[i]._id);
  }

  for (let i = 200; i < 600; i++) {
    h2.push(users[i]._id);
  }

  for (let i = 400; i < 800; i++) {
    h3.push(users[i]._id);
  }

  for (let i = 600; i < 1000; i++) {
    h4.push(users[i]._id);
  }

  for (let i = 800; i < 1200; i++) {
    h5.push(users[i]._id);
  }

  hashtags.forEach(async (hashtag, i) => {
    let h;
    if (i === 0) h = h1;
    else if (i === 1) h = h2;
    else if (i === 2) h = h3;
    else if (i === 3) h = h4;
    else if (i === 4) h = h5;

    await Hashtag.update({ hashtag }, { $push: { follower: { $each: h } } });
  });
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else if (process.argv[2] === "-ch") {
  createHashtag();
} else if (process.argv[2] === "-ath") {
  addUsersToHashtags();
}
