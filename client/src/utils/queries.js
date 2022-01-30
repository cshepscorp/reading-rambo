import { gql } from "@apollo/client";

export const QUERY_ME = gql`
{
  me {
    _id
    username
    email
    mediaCount

  }
}
`;

export const QUERY_ME_SIMPLE = gql`
  {
    me {
      _id
      username
      email
      mediaCount
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
        _id
        title
      }
    }
  }
`;
