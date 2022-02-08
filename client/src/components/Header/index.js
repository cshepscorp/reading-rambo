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
    <header>
      <div>
        <Button href='/'>
          <h1 id='logo'>reading rambo</h1>
        </Button>

        <nav className='navbar'>
          {Auth.loggedIn() ? (
            <>
              <Button id='mystuff-nav' href='/mymedia'>
                my content
              </Button>{' '}
              |{' '}
              <Button id='logout-nav' href='/' onClick={logout}>
                logout
              </Button>
            </>
          ) : (
            <>
              <Button id='login-nav' href='/login'>
                login
              </Button>{' '}
              |{' '}
              <Button id='signup-nav' href='/signup'>
                signup
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
