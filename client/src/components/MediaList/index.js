import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import { Button, Card, Container } from '@mui/material';
const MediaList = ({ medias, title }) => {
  if (!medias.length) {
    return <h3>No Lists Yet</h3>;
  }
  return (
    <div>
      <h3>{title}</h3>
      <Card>
        {medias &&
          medias.map((media) => (
            <Card key={media._id} className='card mb-3'>
              {media.image ? (
                <Button href={`/media/${media.mediaId}`}>
                  <img
                    className='feed-image'
                    src={media.image}
                    alt={`The main graphic for ${media.title}`}
                  />
                </Button>
              ) : null}
              <Card>
                <Link
                  to={`/profile/${media.username}`}
                  style={{ fontWeight: 300 }}
                  className='text-light'
                >
                  {media.username}
                </Link>{' '}
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
                  <Link to={`/media/${media.mediaId}`}>
                    <p className='mb-0'>
                      {`${media.reactionCount} ${
                        media.reactionCount === 1 ? 'reaction' : 'reactions'
                      }`}{' '}
                      || Click to {media.reactionCount ? 'join' : 'start'} the
                      discussion!
                    </p>
                  </Link>
                )}
                <p className='small'>added {media.createdAt}</p>
                {/* {media.stars ? (
                  <p className="small">
                    <a href={`https://www.imdb.com/title/${media.mediaId}`}>
                      See full listing on IMDB
                    </a>
                  </p>
                ) : null}
                {media.authors !== '' ? (
                  <p className="small">
                    <a
                      href={`https://www.googleapis.com/books/v1/volumes?q=${media.mediaId}`}
                    >
                      See full listing via Google Book Bearch
                    </a>
                  </p>
                ) : null} */}
              </Card>
            </Card>
          ))}
      </Card>
    </div>
  );
};
export default MediaList;
