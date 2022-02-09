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

export const REMOVE_MEDIA = gql`
  mutation removeMedia($mediaId: ID!) {
    removeMedia(mediaId: $mediaId) {
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

export const ADD_REACTION = gql`
  mutation addReaction($mediaId: ID!, $reactionBody: String!) {
    addReaction(mediaId: $mediaId, reactionBody: $reactionBody) {
      mediaId
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;
export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;
