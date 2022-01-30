import React, { useState } from 'react';
import './style.css';

import { searchGoogleBooks } from '../../utils/API';

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
        <div>
          {searchedBooks.map((book) => {
            return (
              <div key={book.bookId}>
                <h4>{book.title}</h4>
                <p>lorem ipsum placeholder</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
