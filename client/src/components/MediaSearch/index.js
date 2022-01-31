import React, { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import { searchOmdb } from "../../utils/API";
import { ADD_MEDIA } from "../../utils/mutations";
import { QUERY_ME } from "../../utils/queries";
import { saveMediaIds, getSavedMediaIds } from "../../utils/localStorage";
import { useMutation } from "@apollo/client";

const MediaSearch = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);

  const [mediaSearchInput, setMediaSearchInput] = useState("");

  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());

  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  console.log("=====LOGGED IN?=====");
  const loggedIn = Auth.loggedIn();
  console.log(loggedIn);

  // save media
  const [addMedia, { error }] = useMutation(ADD_MEDIA, {
    update(cache, { data: { addMedia } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, savedMedia: [...me.savedMedia, addMedia] } },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleMedia = async (e) => {
    e.preventDefault();

    if (!mediaSearchInput) {
      return false;
    }

    try {
      const response = await searchOmdb(mediaSearchInput);
      //const response = await searchImdb(mediaSearchInput);

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const { Search } = await response.json();

      // OMDB API
      const mediaData = Search.map((media) => ({
        mediaId: media.imdbID,
        title: media.Title,
        year: media.Year,
        image: media.Poster,
      }));

      console.log(mediaData);
      setSearchedMedia(mediaData);
      setMediaSearchInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveMedia = async (mediaId) => {
    const mediaToSave = searchedMedia.find(
      (media) => media.mediaId === mediaId
    );

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("=====user token on save media action========");
    console.log(token);

    if (!token) {
      return false;
    }

    try {
      await addMedia({
        variables: { input: mediaToSave },
      });
      setSavedMediaIds([...savedMediaIds, mediaToSave.mediaId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      --------------------
      <h2>related media</h2>
      <div>
        <form onSubmit={handleMedia} id="searchbar">
          <input
            type="text"
            name="mediaSearchInput"
            value={mediaSearchInput}
            onChange={(e) => setMediaSearchInput(e.target.value)}
            placeholder="search for movies/series"
          ></input>
          <button type="submit">search</button>
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
                {Auth.loggedIn() && (
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
                {error && <div>Book save failed</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaSearch;
