import React from 'react';
// import { useQuery } from '@apollo/client';
// import { QUERY_ME } from '../utils/queries';
// import Auth from '../utils/auth';

// create state to hold saved bookId values
//   const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

// set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
//   useEffect(() => {
//     return () => saveBookIds(savedBookIds);
//   });

const Homepage = () => {
  return (
    <div>
      <h2>where would you like to look?</h2>

      <div>
        <a href='/searchbooks'>
          <button>books</button>
        </a>
      </div>

      <div>
        <a href='/searchscreens'>
          <button>screens</button>
        </a>
      </div>
    </div>
  );
};

export default Homepage;
