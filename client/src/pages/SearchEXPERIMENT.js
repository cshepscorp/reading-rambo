import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import { ADD_MEDIA } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import { saveMediaIds, getSavedMediaIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { searchBooks, searchScreens } from '../utils/search';
import SearchType from "../components/SearchType";

const SearchScreens = () => {
  const [searchedMedia, setSearchedMedia] = useState([]);
  const [mediaSearchInput, setMediaSearchInput] = useState('');
  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());
  const [relatedSearchValue, setRelatedSearchValue] = useState('');

  //this sets the media search type to either screens or books
  const [mediaSearchType, setMediaSearchType] = useState("");
  const [activeRadioButton, setActiveRadioButton] = useState("");
  const [lastMediaTypeSearched, setLastMediaTypeSearched] = useState("");

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
  useEffect( async () => {
    console.log("relatedSearchValue: " + relatedSearchValue);

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
  }, [relatedSearchValue])

  // console.log('=====LOGGED IN?=====');
  const loggedIn = Auth.loggedIn();
  // console.log(loggedIn);
  console.log("");
  console.log("Search type: " + mediaSearchType);
  console.log("Active radiobutton: " + activeRadioButton);
  console.log("Last media type searched: " + lastMediaTypeSearched);
  console.log("Related search value:" + relatedSearchValue);


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

  /**
   * Checks to see if the search bar is filled, and then
   * sets the mediaSearchType, activating the useEffect
   * that handles the actual search
   */
  const handleMedia = async (e) => {
    e.preventDefault();
    console.log("handleMedia activated");

    if (!mediaSearchInput) {
      return false;
    }
    setMediaSearchType(activeRadioButton);
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
      <h2>Media Search</h2>

      {/* Some sort of button here could indicate which type of media to search
          Also these buttons need to become unclickable while the search is going somehow */}
      <SearchType setActiveRadioButton={setActiveRadioButton} />

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
          {/* The elements below will actually successfully display attributes from either books or movies */}
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
                  {lastMediaTypeSearched === "screens" ? "See Related Books" : "See Related Movies"}
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
