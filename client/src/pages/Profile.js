import React, { useEffect, useState } from 'react';
// redirect allows us to redirect a user to another; kind of like window.replace() but it works without having to refresh
import { Redirect, useParams } from 'react-router-dom';
import MediaList from '../components/MediaList';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Container } from '@mui/material';
import { saveFriendIds, getSavedFriendIds } from '../utils/localStorage';

// friend stuff
import FriendList from '../components/FriendList';
import { ADD_FRIEND } from '../utils/mutations';

import Auth from '../utils/auth';

const Profile = (props) => {
  const [addFriend] = useMutation(ADD_FRIEND);
  // SAVE MEDIA query
  const { username: userParam } = useParams();

  // Now if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // saved friend Id
  const [savedFriendIds, setSavedFriendIds] = useState(getSavedFriendIds());
  useEffect(() => {
    return () => saveFriendIds(savedFriendIds);
  });

  // when we run QUERY_ME, the response will return with our data in the me property; but if it runs QUERY_USER instead, the response will return with our data in the user property. Now we have it set up to check for both.
  const user = data?.me || data?.user || {};

  console.log('=======USER PROFILE DATA======');
  console.log(user);

  // redirect to personal page if username is logged-in user's username
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to='/mymedia' />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // if there is no user data to display, we know that we aren't logged in or at another user's profile page
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  const handleSaveFriend = async (friendId) => {
    try {
      console.log(user._id);
      await addFriend({
        variables: { id: user._id }
      });
      setSavedFriendIds([...savedFriendIds, user._id.friendId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className='flex-row mb-3'>
        <h2 className='bg-dark text-secondary p-3 display-inline-block'>
          {/* if userParam doesn't exist, we'll get a message saying "Viewing your profile." Otherwise, it will display the username of the other user on their profile. */}
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {Auth.loggedIn() && (
          <Container>
            <Button
              id='save-content-btn'
              disabled={savedFriendIds?.some(
                (savedFriendId) => savedFriendId === user.friendId
              )}
              onClick={() => handleSaveFriend(user.friendId)}
            >
              {savedFriendIds?.some(
                (savedFriendId) => savedFriendId === user.friendId
              )
                ? `person added to my friends`
                : 'add friend'}
            </Button>
          </Container>
        )}
        <br></br>
        {/* {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )} */}
      </div>
      <div className='flex-row justify-space-between mb-3'>
        <div className='col-12 mb-3 col-lg-8'>
          <MediaList
            medias={user.savedMedia}
            title={`${user.username}'s media...`}
          />
        </div>
      </div>
      <br></br>
      <Container>
        <FriendList
          username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
        />
      </Container>
      <div id='whitespace'> </div>
    </div>
  );
};

export default Profile;
