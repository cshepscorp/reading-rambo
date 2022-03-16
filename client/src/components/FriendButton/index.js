import React from 'react';
import './style.css';
import { Button, Container } from '@mui/material';

const FriendButton = ({ user, friends, handleSaveFriend }) => {
  console.log(friends);
  if (!friends || !friends.length) {
    return (
      <p className="bg-dark text-light p-3">
        {user.username}, make some friends!
      </p>
    );
  }

  if (friends) {
    return (
      <Container>
        <Button
          id="save-content-btn"
          disabled={friends.some((id) => id === user._id)}
          // style={
          //   alreadyFriends ? { display: 'none' } : { display: 'block' }
          // }
          onClick={() => handleSaveFriend(user.friendId)}
        >
          {friends.some((id) => id === user._id)
            ? `person added to my friends`
            : 'add friend'}
        </Button>
      </Container>
    );
  }

  //   return (
  //     <div>
  //       <h5>
  //         {user.username}'s
  //       </h5>
  //       {/* {friends.map((friend) => (
  //         <Container>
  //           <Button id='prof-link-btn'>
  //             <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
  //           </Button>
  //         </Container>
  //       ))} */}
  //     </div>
  //   );
};

export default FriendButton;
