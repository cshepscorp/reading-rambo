import React, { useState } from 'react';

import { searchOmdb } from '../../utils/API';

const MediaSearch = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);

  const [mediaSearchInput, setMediaSearchInput] = useState('');

  const handleMedia = async (e) => {
    e.preventDefault();

    if (!mediaSearchInput) {
      return false;
    }

    try {
      const response = await searchOmdb(mediaSearchInput);

      if (!response.ok) {
        throw new Error('something went wrong');
      }

      const { Search } = await response.json();

      const mediaData = Search.map((media) => ({
        mediaId: media.imdbID,
        title: media.Title,
        writers: media.writer
      }));

      setSearchedMedia(mediaData);
      setMediaSearchInput('');
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div>
        --------------------
      <h2>related media</h2>
      <div>
        <form onSubmit={handleMedia} id='searchbar'>
          <input
            type='text'
            name='mediaSearchInput'
            value={mediaSearchInput}
            onChange={(e) => setMediaSearchInput(e.target.value)}
            placeholder='media stuff?'
          ></input>
          <button type='submit'>search</button>
        </form>
      </div>

      <div id='media-search-results'>
        <div>
          {searchedMedia.map((media) => {
            return (
              <div key={media.mediaId}>
                <h4>{media.title}</h4>
                <p>lorem ipsum placeholder</p>
                <p>more info link here....</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaSearch;
