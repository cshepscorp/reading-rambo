import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      mediaCount
      savedMedia {
        title
        bookId
        mediaId
        year
        plot
        description
        director
        actors
        authors
        poster
        image
        createdAt
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      mediaCount
      savedMedia {
        title
        bookId
        mediaId
        year
        plot
        description
        director
        actors
        authors
        poster
        image
        createdAt
      }
    }
  }
`;
