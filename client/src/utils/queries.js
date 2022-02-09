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
        reactionCount
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
        reactionCount
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
      mediaId
      reactionCount
    }
  }
`;

export const QUERY_SINGLE_MEDIA = gql`
  query media($mediaId: ID!) {
    media(mediaId: $mediaId) {
      title
      mediaId
      image
      reactionCount
      createdAt
      reactions {
        _id
        reactionBody
        username
        createdAt
      }
    }
  }
`;
