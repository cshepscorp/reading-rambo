import React, { useEffect, useState } from 'react';
import './style.css';
import Auth from '../../utils/auth';
import { ADD_MEDIA } from '../../utils/mutations';
import { QUERY_ME, QUERY_MEDIA } from '../../utils/queries';
import { saveMediaIds, getSavedMediaIds } from '../../utils/localStorage';
import { searchBooks, searchScreens } from '../../utils/search';
import { useMutation } from '@apollo/client';
import { Button, Container, TextField } from '@mui/material';

// for media feed
import MediaList from '../MediaList';
import { useQuery } from "@apollo/client";

const Home = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);
  const [mediaSearchInput, setMediaSearchInput] = useState('');
  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());
  // STATE for related media button
  const [relatedSearchValue, setRelatedSearchValue] = useState('');
  //this sets the media search type to either screens or books
  const [mediaSearchType, setMediaSearchType] = useState('');
  const [lastMediaTypeSearched, setLastMediaTypeSearched] = useState('');

  // effect saves mediaId to passed to the state handler
  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  // effect for related media button
  useEffect(async () => {
    console.log('relatedSearchValue: ' + relatedSearchValue);

    if (!relatedSearchValue) {
      return false;
    }

    let mediaData = 'error';
    if (mediaSearchType === 'books') {
      mediaData = await searchScreens(relatedSearchValue);
    } else if (mediaSearchType === 'screens') {
      mediaData = await searchBooks(relatedSearchValue);
    } else {
      throw new Error('Neither search type selected!');
    }
    console.log(mediaData);
    setSearchedMedia(mediaData);
    setMediaSearchInput('');
  }, [relatedSearchValue]);

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

    // to pull in medialist feed
    const { data } = useQuery(QUERY_MEDIA);
    const medias = data?.mediaFeed || [];
    console.log("all media items incl fake data");
    console.log(medias);

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
                  className='single-media-image'
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
                  {lastMediaTypeSearched === 'screens'
                    ? 'See Related Books'
                    : 'See Related Movies'}{' '}
                </Button>
                {Auth.loggedIn() && (
                  <Button
                    id='save-content-btn'
                    disabled={savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )}
                    onClick={() => handleSaveMedia(media.mediaId)}
                  >
                    {savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )
                      ? `item saved to 'my content'`
                      : 'save this'}
                  </Button>
                )}
                {error && <div>save failed</div>}
              </Container>
            );
          })}
        </Container>
      </Container>
      <Container className="cardHolder" id='media-feed'>
        <MediaList medias={medias} title="activity feed" />
      </Container>
    </div>
  );
};

export default Home;
