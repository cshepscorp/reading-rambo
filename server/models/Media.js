const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');
const mediaSchema = new Schema(
  {
    mediaId: { type: String },
    bookId: { type: String },
    title: {
      type: String,
      required: true
    },
    year: {
      type: String
    },
    director: {
      type: String
    },
    actors: {
      type: String
    },
    authors: [
      {
        type: String,
      },
    ],
    plot: {
      type: String
    },
    description: {
      type: String
    },
    poster: { type: String },
    image: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp)
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      getters: true
    }
  }
);

mediaSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Media = model('Media', mediaSchema);

module.exports = Media;
