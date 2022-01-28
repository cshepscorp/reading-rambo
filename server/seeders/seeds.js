const faker = require("faker");

const db = require("../config/connection");
const { Comment, User, Media } = require("../models");

db.once("open", async () => {
  await Comment.deleteMany({});
  await User.deleteMany({});
  await Media.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({ username, email, password });
  }

  const createdUsers = await User.collection.insertMany(userData);

  // create comments
  let createdComments = [];
  for (let i = 0; i < 100; i += 1) {
    const commentText = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username, _id: userId } = createdUsers.ops[randomUserIndex];

    const createdComment = await Comment.create({ commentText, username });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { comments: createdComment._id } }
    );

    createdComments.push(createdComment);
  }

  // create media
  let createdMedias = [];
  for (let i = 0; i < 100; i += 1) {
    const title = faker.lorem.words(Math.round(Math.random() * 3) + 1);
    const imdbID = Math.round(Math.random() * 10) + 1;
    const actors = faker.lorem.words(Math.round(Math.random() * 5) + 1);

    const plot = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username, _id: userId } = createdUsers.ops[randomUserIndex];

    const createdMedia = await Media.create({
      title,
      actors,
      plot,
      imdbID,
      username,
    });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { media: createdMedia } }
    );

    createdMedias.push(createdMedia);
    console.log("===createdMedias====");
    console.log(createdMedias);
  }

  console.log("all done!");
  process.exit(0);
});
