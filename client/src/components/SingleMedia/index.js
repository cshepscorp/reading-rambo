import React from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import ReactionList from '../../components/ReactionList';
import ReactionForm from '../../components/ReactionForm';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_MEDIA } from '../../utils/queries';
import { Button, Card, Container } from '@mui/material';

const SingleMedia = (props) => {
  const { id: mediaId } = useParams();
  console.log(mediaId);
  const { loading, data } = useQuery(QUERY_SINGLE_MEDIA, {
    variables: { mediaId: mediaId }
  });
  console.log(data);
  const media = data?.media || {};
  console.log('media results');
  console.log(media);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
          {media.image ? (
            <img
              className='single-media-image'
              src={media.image}
              alt={`The main graphic for ${media.title}`}
            />
          ) : null}
        {/* <span style={{ fontWeight: 700 }} className="text-light">
            {media.username}
          </span>{" "} */}
        added on {media.createdAt}
        <div className='card-body'>
          <p>{media.title}</p>
          <p>{media.year}</p>
        </div>
      </Card>

      {media.reactionCount > 0 && <ReactionList reactions={media.reactions} />}
      {Auth.loggedIn() && <ReactionForm mediaId={media.mediaId} />}
    </Container>
  );
};

export default SingleMedia;
