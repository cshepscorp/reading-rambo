const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    mediaCount: Int
    medias: [Media]
    comments: [Comment]
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
    username: String
  }

  input MediaInput {
    title: String
    imdbID: String
    year: String
    director: String
    actors: String
    plot: String
    poster: String
  }

  type Media {
    _id: ID!
    createdAt: String
    username: String
    imdbID: String
    title: String
    year: String
    director: String
    actors: String
    plot: String
    poster: String
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
    medias(username: String): [Media]
    media(_id: ID!): Media
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addComment(commentText: String!): Comment
    addMedia(input: MediaInput): Media
    addReaction(mediaId: ID!, reactionBody: String!): Media
  }
`;

module.exports = typeDefs;
