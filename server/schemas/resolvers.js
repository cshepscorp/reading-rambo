const { User, Comment } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('comments');
    
        return userData;
      }
    
      throw new AuthenticationError('Not logged in');
    },
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
      return User.find().select("-__v -password").populate("comments");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("comments");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addComment: async (parent, args, context) => {
      if (context.user) {
        const comment = await Comment.create({ ...args, username: context.user.username });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { comments: comment._id } },
          { new: true }
        );
    
        return comment;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    saveMedia: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedMedia: input } },
          { new: true }
        )
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addReaction: async (parent, { mediaId, reactionBody }, context) => {
      if (context.user) {
        const updatedMedia = await Media.findOneAndUpdate(
          { _id: mediaId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedMedia;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
