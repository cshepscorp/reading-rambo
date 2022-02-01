import React from 'react';
// import { useQuery } from '@apollo/client';
// import { QUERY_ME } from '../utils/queries';
// import Auth from '../utils/auth';

import { Container, Button } from 'react-bootstrap';

// create state to hold saved bookId values
//   const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

// set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
//   useEffect(() => {
//     return () => saveBookIds(savedBookIds);
//   });

const Homepage = () => {
  return (
    <Container>
      <h2>where would you like to look?</h2>

      <div>
        <Button href='/searchbooks'>books</Button>
      </div>

      <div>
        <Button href='/searchscreens'>screens</Button>
      </div>
    </Container>
  );
};

export default Homepage;
