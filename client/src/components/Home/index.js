import React, { useEffect, useState } from 'react';
import './style.css';
import Auth from '../../utils/auth';
import { ADD_MEDIA } from '../../utils/mutations';
import { QUERY_ME, QUERY_MEDIA } from '../../utils/queries';
import { saveMediaIds, getSavedMediaIds } from '../../utils/localStorage';
import { searchBooks, searchScreens } from '../../utils/search';
import { useMutation } from '@apollo/client';
import { Button, Card, Container, TextField } from '@mui/material';

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

  /**
 * Activates when mediaSearchType is altered. Checks to see 
 * if mediaSearchType is either "books" or "screens", and if
 * neither is true, it terminates. If it is one of those,
 * then it'll do a search and populate for that respective
 * search type. It will then set lastMediaTypeSearched to
 * whatever the last kind of search was (books or screens).
 * Then, it will RESET mediaSearchType to "" (aka nothing).
 * This will activate it again, but it will terminate upon
 * finding mediaSearchType to be empty.
 */
  useEffect(async () => {
    console.log("regular search useEffect activated");

    if (!mediaSearchInput) {
      setMediaSearchType("");
      return;
    }

    let mediaData = "error";
    try {
      if (mediaSearchType === "screens") {
        mediaData = await searchScreens(mediaSearchInput);
      }
      else if (mediaSearchType === "books") {
        mediaData = await searchBooks(mediaSearchInput);
      }
      else {
        return;
      }

      setSearchedMedia(mediaData);
      setLastMediaTypeSearched(mediaSearchType);
      setMediaSearchInput('');
      setMediaSearchType("");
    } catch (error) {
      console.log(error);
    }
  }, [mediaSearchType]);

  /**
    * Activates when relatedSearchValue is changed, which happens when
    * a "find related media" button is clicked. Checks lastMediaTypeSearched
    * to see what the last media type searched was, and then searches for
    * the OPPOSITE of that, in order to get related media. Doesn't check
    * mediaSearchType intentionally, as that is reset after each search,
    * while lastMediaTypeSearched is not. Then, it resets relatedSearchValue,
    * which reactivates this useEffect, which will immediately terminate once
    * it finds relatedSearchValue to be reset (aka empty).
    */
  useEffect(async () => {
    if (!relatedSearchValue) {
      console.log("No related search value found");
      return false;
    }

    let mediaData = "error";
    if (lastMediaTypeSearched === "books") {
      console.log("last media search type read as books");
      mediaData = await searchScreens(relatedSearchValue);
      setLastMediaTypeSearched("screens");
    }
    else if (lastMediaTypeSearched === "screens") {
      console.log("state read as screens");
      mediaData = await searchBooks(relatedSearchValue);
      setLastMediaTypeSearched("books");
    }
    else {
      console.log("MediaSearchType at time of error:" + mediaSearchType);
      throw new Error("Neither search type selected!")
    }
    console.log(mediaData);
    setSearchedMedia(mediaData);
    setMediaSearchInput('');
    setRelatedSearchValue("");
  }, [relatedSearchValue]);

  // ain't does nothin cowboy
  const handleMedia = async (e) => {
    e.preventDefault();
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
        {searchedMedia.map((media) => {
          return (
            <Card id='card-feed' key={media.mediaId}>
              {media.image ? (
                <img
                  className='single-media-image'
                  src={media.image}
                  alt={`The poster for ${media.title}`}
                  variant='top'
                />
              ) : null}
              <h4>{media.title}</h4>
              {media.year ? <p className='small'>Year: {media.year}</p> : null}
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
            </Card>
          );
        })}
      </Container>
      <Container className='cardHolder' id='media-feed'>
        <MediaList medias={medias} title='activity feed' />
      </Container>
    </div>
  );
};

export default Home;
