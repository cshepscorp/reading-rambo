import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import { Button, Card } from '@mui/material';

const MediaList = ({ medias, title }) => {
  if (!medias.length) {
    return <h3>No Lists Yet</h3>;
  }
  return (
    <div>
      <h3>{title}</h3>
      {medias &&
        medias.map((media) => (
          <Card id='card-feed' key={media._id}>
            {media.image ? (
              <Button href={`/media/${media.mediaId}`}>
                <img
                  className='feed-image'
                  src={media.image}
                  alt={`The main graphic for ${media.title}`}
                />
              </Button>
            ) : null}
            {/* <Link
              to={`/profile/${media.username}`}
              style={{ fontWeight: 300 }}
              className='text-light'
            >
              {media.username}
            </Link>{' '} */}
            <p>{media.title}</p>
            {media.year ? (
              <p className='small year'>Year: {media.year}</p>
            ) : null}
            {media.stars ? (
              <p className='small stars'>Starring: {media.stars}</p>
            ) : null}
            {media.description ? (
              <p className='small description'>
                Description: {media.description}
              </p>
            ) : null}
            {Auth.loggedIn() && (
              <Link id='see-reactions' to={`/media/${media.mediaId}`}>
                <p className='mb-0'>
                  {`${media.reactionCount} ${
                    media.reactionCount === 1 ? 'reaction' : 'reactions'
                  }`}{' '}
                  || click to {media.reactionCount ? 'join' : 'start'} the
                  discussion
                </p>
              </Link>
            )}
            <p className='small'>added by <Link
              to={`/profile/${media.username}`}
              style={{ fontWeight: 300 }}
              className='text-light'
            >
              {media.username}
            </Link>{' '} at {media.createdAt}</p>
          </Card>
        ))}
    </div>
  );
};

export default MediaList;
