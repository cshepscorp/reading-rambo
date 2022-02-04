import React, { useEffect, useState } from 'react';
import './style.css';
import Auth from '../../utils/auth';
import { ADD_MEDIA } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';
import { saveMediaIds, getSavedMediaIds } from '../../utils/localStorage';
import { searchBooks, searchScreens } from '../../utils/search';
import { useMutation } from '@apollo/client';
import { Button, Container, TextField } from '@mui/material';

const Home = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);

  const [mediaSearchInput, setMediaSearchInput] = useState('');

  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());

  // related media button WIP
  const [relatedSearchValue, setRelatedSearchValue] = useState('');
  //   console.log('=====Current setRelatedSearchInput value=====');
  //   console.log(relatedSearchValue);

  //this sets the media search type to either screens or books
  const [mediaSearchType, setMediaSearchType] = useState('');

  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  // handles state based on media type being searched
  const handleMedia = async (e) => {
    e.preventDefault();

    if (!mediaSearchInput) {
      return false;
    }

    let mediaData = 'error';
    if (mediaSearchType === 'screens') {
      mediaData = await searchScreens(mediaSearchInput);
    } else if (mediaSearchType === 'books') {
      mediaData = await searchBooks(mediaSearchInput);
    } else {
      throw new Error('Neither search type selected!');
    }

    setSearchedMedia(mediaData);
    setMediaSearchInput('');
  };

  // SAVE MEDIA query
  const [addMedia, { error }] = useMutation(ADD_MEDIA, {
    update(cache, { data: { addMedia } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, savedMedia: [...me.savedMedia, addMedia] } }
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  // SAVE MEDIA HANDLER
  const handleSaveMedia = async (mediaId) => {
    const mediaToSave = searchedMedia.find(
      (media) => media.mediaId === mediaId
    );

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log('=====user token on save media action========');
    console.log(token);

    if (!token) {
      return false;
    }

    try {
      console.log(mediaToSave);
      await addMedia({
        variables: { input: mediaToSave }
      });
      setSavedMediaIds([...savedMediaIds, mediaToSave.mediaId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {' '}
      <div>
        <h2>let's take a look!</h2>
      </div>
      <br></br>
      <form onSubmit={handleMedia} className='container'>
        <div>
          <TextField
            id='standard-search'
            label='search titles'
            type='search'
            variant='filled'
            value={mediaSearchInput}
            onChange={(e) => setMediaSearchInput(e.target.value)}
          />{' '}
        </div>
        <br></br>
        <Button
          type='submit'
          id='book-btn'
          onClick={() => {
            setMediaSearchType('books');
          }}
        >
          books
        </Button>{' '}
        <Button
          type='submit'
          id='screen-btn'
          onClick={() => {
            setMediaSearchType('screens');
          }}
        >
          screens
        </Button>
      </form>{' '}
      <Container id='media-search-results'>
        <Container className='cardHolder'>
          {searchedMedia.map((media) => {
            return (
              <Container className='card' key={media.mediaId}>
                {media.image ? (
                  <img
                    src={media.image}
                    alt={`The poster for ${media.title}`}
                    variant='top'
                  />
                ) : null}
                <h4>{media.title}</h4>
                {media.year ? (
                  <p className='small'>Year: {media.year}</p>
                ) : null}
                {media.stars ? (
                  <p className='small'>Starring: {media.stars}</p>
                ) : null}
                {media.description ? (
                  <p className='small'>Description: {media.description}</p>
                ) : null}
                <Button
                  id='related-btn'
                  value={media.title}
                  onClick={() => setRelatedSearchValue(media.title)}
                >
                  See related Books
                </Button>
                {Auth.loggedIn() && (
                  <Button
                    disabled={savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )}
                    onClick={() => handleSaveMedia(media.mediaId)}
                  >
                    {savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )
                      ? 'This item is saved!'
                      : 'Save this to my list!'}
                  </Button>
                )}
                {error && <div>save failed</div>}
              </Container>
            );
          })}
        </Container>
      </Container>
    </div>
  );
};

export default Home;
