const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    mediaCount: Int
    savedMedia: [List]
    comments: [Comment]
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
    username: String
  }

  type List {
    mediaId: ID!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  input ListInput {
    mediaId: ID!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
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
    saveMedia(input: ListInput!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addComment(commentText: String!): Comment
  }
`;

module.exports = typeDefs;
