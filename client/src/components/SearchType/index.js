import React from "react";

const SearchType = ({ setActiveRadioButton }) => {
  return (
    <div>
      <input type="radio" id="searchBook" name="searchType" onClick={() => { setActiveRadioButton("books") }}></input>
      <label htmlFor="searchBook">Search For Books</label> <br></br>
      <input type="radio" id="searchMovies" name="searchType" onClick={() => { setActiveRadioButton("screens") }}></input>
      <label htmlFor="searchMovies">Search For Movies</label> <br></br>
    </div>
  );
};

export default SearchType;