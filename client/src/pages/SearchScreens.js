import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
//import { searchOmdb } from "../utils/API";
import { searchImdb } from '../utils/API';
import { ADD_MEDIA } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import { saveMediaIds, getSavedMediaIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';

const SearchScreens = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);

  const [mediaSearchInput, setMediaSearchInput] = useState('');

  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());

  const [relatedSearchValue, setRelatedSearchValue] = useState('');
  console.log('=====Current setRelatedSearchInput value=====');
  console.log(relatedSearchValue);

  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  console.log('=====LOGGED IN?=====');
  const loggedIn = Auth.loggedIn();
  console.log(loggedIn);

  // save media
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

  const handleMedia = async (e) => {
    e.preventDefault();

    if (!mediaSearchInput) {
      return false;
    }

    try {
      //const response = await searchOmdb(mediaSearchInput);
      const response = await searchImdb(mediaSearchInput);

      if (!response.ok) {
        throw new Error('something went wrong');
      }

      // OMDB API
      // const { Search } = await response.json();
      // const mediaData = Search.map((media) => ({
      //   mediaId: media.imdbID,
      //   title: media.Title,
      //   year: media.Year,
      //   image: media.Poster,
      // }));

      // IMDB API
      const { results } = await response.json();
      const mediaData = results
        .filter((media, idx) => idx < 12)
        .map((media) => ({
          mediaId: media.id,
          title: media.title,
          year: media.description,
          image: media.image,
          stars: media.stars,
          description: media.plot
        }));
      // console.log("============mediaData from imdb============");
      // console.log(mediaData);

      console.log(mediaData);
      setSearchedMedia(mediaData);
      setMediaSearchInput('');
    } catch (err) {
      console.log(err);
    }
  };

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
      <h2>screens: shows and movies</h2>
      <div>
        <form onSubmit={handleMedia} id='searchbar'>
          <input
            type='text'
            name='mediaSearchInput'
            value={mediaSearchInput}
            onChange={(e) => setMediaSearchInput(e.target.value)}
            placeholder='search for movies/series'
          ></input>
          <button type='submit'>search</button>
        </form>
      </div>
      <div id='media-search-results'>
        <div className='cardHolder'>
          {searchedMedia.map((media) => {
            return (
              <div className='card' key={media.mediaId}>
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
                <button
                  className='btn-block btn-info'
                  value={media.title}
                  onClick={() => setRelatedSearchValue(media.title)}
                >
                  See related Books
                </button>
                {Auth.loggedIn() && (
                  <button
                    disabled={savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )}
                    className='btn-block btn-info'
                    onClick={() => handleSaveMedia(media.mediaId)}
                  >
                    {savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )
                      ? 'This item is saved!'
                      : 'Save this to my list!'}
                  </button>
                )}
                {error && <div>save failed</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchScreens;
