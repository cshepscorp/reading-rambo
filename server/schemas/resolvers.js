const { User, Comment } = require("../models");

const resolvers = {
  Query: {
    comments: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Comment.find().sort({ createdAt: -1 });
    },
    // in case we make it so comments can be 'reacted to'
    comment: async (parent, { _id }) => {
      return Comment.findOne({ _id });
    },
    // get all users
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("comments");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("comments");
    },
  },
};

module.exports = resolvers;
