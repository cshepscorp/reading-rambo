import React from 'react';
// import ReactionList from "../ReactionList";
import './style.css';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_MEDIA } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import { removeMediaId } from '../../utils/localStorage';
import { Button, Card, CardContent, Container } from '@mui/material';

// friend stuff
import FriendList from '../FriendList';

const MyContent = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];
  console.log('=======ME DATA======');

  const [removeMedia] = useMutation(REMOVE_MEDIA);

  const handleDeleteMedia = async (mediaId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await removeMedia({
        variables: { mediaId: mediaId }
      });
      removeMediaId(mediaId);
    } catch (e) {
      console.error(e);
    }
  };

  // if no data say so
  if (loading) {
    return <h2>Loading data...</h2>;
  }

  console.log(userData);

  return (
    <Container>
      <h2>{userData.username}'s saved content</h2>
      <h4>
        {`Viewing ${userData.mediaCount} saved ${
          userData.mediaCount === 1 ? 'item' : 'items'
        }:`}
      </h4>
      {userData.savedMedia.map((media) => {
        return (
          <Card id='mycontent-card' key={media.mediaId}>
            <CardContent>
              {media.image ? (
                <img
                  className='single-media-image'
                  src={media.image}
                  alt={`The main graphic for ${media.title}`}
                  variant='top'
                />
              ) : null}
              <div>
                <p>{media.title}</p>
                {media.year ? (
                  <p className='small'>Year: {media.year}</p>
                ) : null}
                {media.stars ? (
                  <p className='small'>Starring: {media.stars}</p>
                ) : null}
                {media.description ? (
                  <p className='small'>Description: {media.description}</p>
                ) : null}
                {media.link ? <p className='small'>{media.link}</p> : null}
                {`${media.reactionCount} ${
                  media.reactionCount === 1 ? 'reaction' : 'reactions'
                }`}
              </div>
              {Auth.loggedIn() && (
                <Button
                  id='media-link-btn'
                  href={`/media/${media.mediaId}`}
                  style={{ fontWeight: 300 }}
                >
                  Add to the convo...
                </Button>
              )}
              <Button
                id='delete-item-btn'
                onClick={() => handleDeleteMedia(media.mediaId)}
              >
                Delete this item
              </Button>
            </CardContent>
          </Card>
        );
      })}
      <Container id='friend-zone'>
        <FriendList
          username={userData.username}
          friendCount={userData.friendCount}
          friends={userData.friends}
        />
      </Container>
    </Container>
  );
};

export default MyContent;
