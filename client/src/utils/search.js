import { searchImdb } from "./API";
import { searchGoogleBooks } from "./API";

export const searchScreens = async (mediaSearchInput) => {
  try {
    const response = await searchImdb(mediaSearchInput);
  
    if (!response.ok) {
      throw new Error('something went wrong');
    }
  
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
  
    console.log(mediaData);
    return mediaData;
    // setSearchedMedia(mediaData);
    // setMediaSearchInput('');
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const searchBooks = async (mediaSearchInput) => {
  try {
    const response = await searchGoogleBooks(mediaSearchInput);

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

    // setSearchedBooks(bookData);
    // setSearchInput('');
    console.log(bookData);

    return bookData;
  } catch (err) {
    console.log(err);
  }
};

