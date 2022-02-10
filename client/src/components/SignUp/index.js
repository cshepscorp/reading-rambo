import React, { useState } from 'react';
import './style.css';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { Button, Container, TextField } from '@mui/material';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [addUser, { error }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...formState }
      });
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <Container>
          <TextField
            className='form-input'
            placeholder='your username'
            variant='filled'
            name='username'
            type='username'
            id='username'
            value={formState.username}
            onChange={handleChange}
          />
        </Container>
        <br></br>
        <Container>
          <TextField
            className='form-input'
            placeholder='your email'
            variant='filled'
            name='email'
            type='email'
            id='email'
            value={formState.email}
            onChange={handleChange}
          />
        </Container>
        <br></br>
        <Container>
          <TextField
            className='form-input'
            placeholder='*password*'
            variant='filled'
            name='password'
            type='password'
            id='password'
            value={formState.password}
            onChange={handleChange}
          />
        </Container>
        <br></br>
        <Button id='signup-btn' type='submit'>
          Submit
        </Button>
        {error && <div>Sign up failed</div>}
      </form>
    </Container>
  );
};

export default Signup;
