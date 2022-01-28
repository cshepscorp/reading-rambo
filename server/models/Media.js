const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    director: {
      type: String,
    },
    actors: {
      type: String,
    },
    plot: {
      type: String,
    },
    imdbID: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

mediaSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Media = model("Media", mediaSchema);

module.exports = Media;
