import React from 'react';
import './style.css';
import { Button, TextField } from '@mui/material';

const Home = () => {
  return (
    <div>
      {' '}
      <div>
        <h2>let's take a look!</h2>
      </div>
      <br></br>
      <div className='container'>
        <div>
          <TextField
            id='standard-search'
            label='search titles'
            type='search'
            variant='filled'
          />{' '}
        </div>
        <br></br>
        <Button id='book-btn' href='/searchbooks'>
          books
        </Button>{' '}
        <Button id='screen-btn' href='/searchscreens'>
          screens
        </Button>
      </div>{' '}
      <div id='result-container'> </div>
    </div>
  );
};

export default Home;
