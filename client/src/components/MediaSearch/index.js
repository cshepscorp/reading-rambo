import React, { useState } from 'react';
import Auth from "../../utils/auth";
import { searchOmdb } from '../../utils/API';
//import { QUERY_ME } from "../../utils/queries";

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
        year: media.Year,
        image: media.Poster,
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

      <div id="media-search-results">
        <div className="cardHolder">
          {searchedMedia.map((media) => {
            return (
              <div className="card" key={media.mediaId}>
                {media.image ? (
                  <img
                    src={media.image}
                    alt={`The poster for ${media.title}`}
                    variant="top"
                  />
                ) : null}
                <h4>{media.title}</h4>
                <p>Year: {media.year}</p>
                <p>id: {media.mediaId}</p>
                <button className="btn-block btn-info">See related Books</button>
                {/* {Auth.loggedIn() && (
                  <button
                    disabled={savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )}
                    className="btn-block btn-info"
                    onClick={() => handleSaveMedia(media.mediaId)}
                  >
                    {savedMediaIds?.some(
                      (savedMediaId) => savedMediaId === media.mediaId
                    )
                      ? "This item is saved!"
                      : "Save this to my list!"}
                  </button>
                )}
                {error && <div>Book save failed</div>} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaSearch;
