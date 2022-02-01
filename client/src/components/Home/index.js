import React, { useState } from 'react';
import './style.css';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import { searchGoogleBooks } from '../../utils/API';
import Auth from '../../utils/auth';

// create state to hold saved bookId values
//   const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

// set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
//   useEffect(() => {
//     return () => saveBookIds(savedBookIds);
//   });

const Home = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  const loggedIn = Auth.loggedIn();
  console.log('====is user logged in?');
  console.log(loggedIn);

  const { data: userData } = useQuery(QUERY_ME);

  console.log('====ME data');
  console.log(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong');
      }

      const { items } = await response.json();

      // deconstruct book data into Json format to be returned in our component
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
      console.log(searchInput);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id='searchbar'>
        <input
          type='text'
          name='searchInput'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='form-control'
          placeholder='type a book'
        ></input>
        <button className='btn' type='submit'>
          search
        </button>
      </form>

      <div id='search-results'>
        <h2>
          {searchedBooks.length
            ? `Showing ${searchedBooks.length} results`
            : 'search for a book to begin!'}
        </h2>
        <div className='cardHolder'>
          {searchedBooks.map((book) => {
            return (
              <div className='card' key={book.bookId}>
                {book.image ? (
                  <img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                ) : null}
                <h4>{book.title}</h4>
                <p>Year: {book.year}</p>
                <p>id: {book.bookId}</p>
                <button className='btn-block btn-info'>
                  See related Media
                </button>
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

export default Home;
