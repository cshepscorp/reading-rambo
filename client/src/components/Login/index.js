import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import './style.css';
import { Button, Container, TextField } from '@mui/material';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });

  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState }
      });
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
      <div>
        <h2>welcome back</h2>
        <div>
          <form onSubmit={handleFormSubmit}>
            <label for='email'>email:</label>
            <input
              className='form-input'
              placeholder='Your email'
              name='email'
              type='email'
              id='email'
              value={formState.email}
              onChange={handleChange}
            />{' '}
            <br></br>
            <label for='password'>password:</label>
            <input
              className='form-input'
              placeholder='******'
              name='password'
              type='password'
              id='password'
              value={formState.password}
              onChange={handleChange}
            />
            <br></br>
            <Button id='submit' type='submit'>
              Submit
            </Button>
            {error && <div>Login failed</div>}
          </form>
        </div>
      </div>
  );
};

export default Login;
