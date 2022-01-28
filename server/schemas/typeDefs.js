const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
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
    title: String
    year: String
    director: String
    actors: String
    plot: String
    poster: String
  }

  type Media {
    imdbID: ID!
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
    media(username: String): [Media]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addComment(commentText: String!): Comment
    saveMedia(input: MediaInput): User
    addReaction(mediaId: ID!, reactionBody: String!): Media
  }
`;

module.exports = typeDefs;
