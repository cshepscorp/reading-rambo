import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      mediaCount
      savedMedia {
        username
        title
        bookId
        mediaId
        year
        plot
        description
        director
        stars
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
        username
        title
        bookId
        mediaId
        year
        plot
        description
        director
        stars
        authors
        poster
        image
        createdAt
      }
    }
  }
`;

export const QUERY_MEDIA = gql`
  query mediaFeed($username: String) {
    mediaFeed(username: $username) {
      title
      image
      createdAt
      username
    }
  }
`;
