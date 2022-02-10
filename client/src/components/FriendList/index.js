import React from "react";
import { Link } from "react-router-dom";
import { Button } from '@mui/material';

const FriendList = ({ friendCount, username, friends }) => {
  console.log(friends);
  if (!friends || !friends.length) {
    return (
      <p className="bg-dark text-light p-3">{username}, make some friends!</p>
    );
  }

  return (
    <div>
      <h5>
        {username}'s {friendCount} {friendCount === 1 ? "friend" : "friends"}
      </h5>
      {friends.map((friend) => (
                <Button
                type='submit'
                id='book-btn'
              >
                <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
              </Button>
      ))}
    </div>
  );
};

export default FriendList;
