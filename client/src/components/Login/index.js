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
      <Container>
        <form onSubmit={handleFormSubmit}>
          {/* <label for='email'>email:</label> */}
          <Container>
            <TextField
              id='email-input'
              variant='filled'
              placeholder='your email'
              name='email'
              type='email'
              value={formState.email}
              onChange={handleChange}
            />{' '}
          </Container>
          <br></br>
          {/* <label for='password'>password:</label> */}
          <Container>
            <TextField
              id='password-input'
              variant='filled'
              placeholder='*password*'
              name='password'
              type='password'
              value={formState.password}
              onChange={handleChange}
            />
          </Container>
          <br></br>
          <Button id='submit' type='submit'>
            Submit
          </Button>
          {error && <div>Login failed</div>}
        </form>
      </Container>
    </div>
  );
};

export default Login;
