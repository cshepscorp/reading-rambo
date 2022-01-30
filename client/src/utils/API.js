// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

// search to OMDB API
// https://www.omdbapi.com/?apikey=40e85cd&t=game+of+thrones
export const searchOmdb = (query) => {
  return fetch(`https://www.omdbapi.com/?apikey=40e85cd&s=${query}`);
};


export const searchImdb = (query) => {
  return fetch(`https://imdb-api.com/API/AdvancedSearch/k_ie48e5ua?title=${query}`);
};
