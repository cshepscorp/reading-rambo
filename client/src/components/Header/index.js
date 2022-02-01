import React from 'react';
import './style.css';
import { Button } from 'react-bootstrap';
import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className='bg-secondary mb-4 py-2 flex-row align-center'>
      <div className='container flex-row justify-space-between-lg justify-center align-center'>
        <Button href='/'>
          <h1>reading rambo</h1>
        </Button>

        <nav className='navbar'>
          {Auth.loggedIn() ? (
            <>
              <Button href='/mymedia'>my stuff</Button> |{' '}
              <Button href='/' onClick={logout}>
                logout
              </Button>
            </>
          ) : (
            <>
              <Button href='/login'>login</Button> |{' '}
              <Button href='/signup'>signup</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
