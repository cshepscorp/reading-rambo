import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_MEDIA = gql`
  mutation addMedia($input: MediaInput!) {
    addMedia(input: $input) {
      username
      savedMedia {
        title
        imdbId
        year
        plot
        director
        actors
        authors
        poster
        image
      }
    }
  }
`;

export const REMOVE_MEDIA = gql`
  mutation removeMedia($mediaId: ID!) {
    removeMedia(mediaId: $mediaId) {
      _id
      username
      email
      mediaCount
      savedMedia {
        title
        imdbId
        year
        plot
        director
        actors
        authors
        poster
        image
      }
    }
  }
`;