const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    stupidThing: String
    mediaCount: Int
    savedMedia: [Media]
    comments: [Comment]
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
    username: String
  }

  input MediaInput {
    mediaId: ID
    title: String
    imdbID: String
    year: String
    plot: String
    director: String
    actors: String
    authors: String
    poster: String
    image: String
  }

  type Media {
    mediaId: ID
    createdAt: String
    username: String
    title: String
    imdbID: String
    year: String
    plot: String
    director: String
    actors: String
    authors: String
    poster: String
    image: String
    reactions: [Reaction]
    reactionCount: Int
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    comments(username: String): [Comment]
    comment(_id: ID!): Comment
    savedMedia(username: String): [Media]
    media: [Media]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addComment(commentText: String!): Comment
    addMedia(input: MediaInput!): User
    removeMedia(mediaId: ID!): User
    addReaction(mediaId: ID!, reactionBody: String!): Media
  }
`;

module.exports = typeDefs;
//    media(_id: ID!): Media
