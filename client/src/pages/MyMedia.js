import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_MEDIA } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries'
import Auth from '../utils/auth';
import { removeMediaId } from '../utils/localStorage';

const MyMedia = () => {
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
    <main>
      <div>
        <h1>My saved media!</h1>
      </div>
      <div>
        <h2>
          {userData.mediaCount.length
            ? `Viewing ${userData.mediaCount.length} saved ${
                userData.mediaCount.length === 1 ? 'item' : 'items'
              }:`
            : 'You have no saved items!'}
        </h2>
        <div>
          <div className='cardHolder'>
            {userData.savedMedia.map((media) => {
              return (
                <div className='card' key={media.mediaId} border='dark'>
                  {media.image ? (
                    <img
                      src={media.image}
                      alt={`The main graphic for ${media.title}`}
                      variant='top'
                    />
                  ) : null}
                  <div>
                    <p>{media.title}</p>
                    <p className='small'>People: {media.authors}</p>
                    {media.link ? <p>{media.link}</p> : null}
                    <p>{media.description}</p>
                    <button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteMedia(media.mediaId)}
                    >
                      Delete this item!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyMedia;
