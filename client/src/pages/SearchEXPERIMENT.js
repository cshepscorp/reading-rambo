import React, { useEffect, useState } from "react";
import Auth from "../utils/auth";
import { searchImdb } from "../utils/API";
import { ADD_MEDIA } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { saveMediaIds, getSavedMediaIds } from "../utils/localStorage";
import { useMutation } from "@apollo/client";
import { searchBooks, searchScreens } from "../utils/search";

const SearchScreens = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);

  const [mediaSearchInput, setMediaSearchInput] = useState("");

  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());

  const [relatedSearchValue, setRelatedSearchValue] = useState("");
  console.log("=====Current setRelatedSearchInput value=====");
  console.log(relatedSearchValue);

  //this sets the media search type to either screens or books
  const [mediaSearchType, setMediaSearchType] = useState("screens");

  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  console.log("=====LOGGED IN?=====");
  const loggedIn = Auth.loggedIn();
  console.log(loggedIn);
  console.log("Search type: " + mediaSearchType);

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

  /**
   * Checks to see if we're searching a movie or book based
   * on the radiobuttons (for now; needs changing), then calls
   * the proper function from utils/search.js to do so,
   * then changes the state to reflect gathered information
   */
  const handleMedia = async (e) => {
    e.preventDefault();

    if (!mediaSearchInput) {
      return false;
    }

    let mediaData = "error";
    if (mediaSearchType === "screens") {
      mediaData = await searchScreens(mediaSearchInput);
    } else if (mediaSearchType === "books") {
      mediaData = await searchBooks(mediaSearchInput);
    } else {
      throw new Error("Neither search type selected!");
    }

    setSearchedMedia(mediaData);
    setMediaSearchInput("");
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
      console.log(mediaToSave);
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
      <h2>screens: shows and movies</h2>
      {/* Some sort of button here could indicate which type of media to search
          Also these buttons need to become unclickable while the search is going somehow */}
      <input
        type="radio"
        id="searchBook"
        name="searchType"
        onClick={() => {
          setMediaSearchType("books");
        }}
      ></input>
      <label htmlFor="searchBook">Search For Books</label> <br></br>
      <input
        type="radio"
        id="searchMovies"
        name="searchType"
        onClick={() => {
          setMediaSearchType("screens");
        }}
      ></input>
      <label htmlFor="searchMovies">Search For Movies</label> <br></br>
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
                {media.year ? (
                  <p className="small">Year: {media.year}</p>
                ) : null}
                {media.stars ? (
                  <p className="small">Starring: {media.stars}</p>
                ) : null}
                {media.description ? (
                  <p className="small">Description: {media.description}</p>
                ) : null}
                <button
                  className="btn-block btn-info"
                  value={media.title}
                  onClick={
                    (() => setRelatedSearchValue(media.title))
                  }
                >
                  See related Books
                </button>
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
