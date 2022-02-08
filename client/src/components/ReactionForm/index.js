import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';
import { Button, Container, TextField } from '@mui/material';

const ReactionForm = ({ mediaId }) => {
  const [reactionBody, setBody] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [addReaction, { error }] = useMutation(ADD_REACTION);

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setBody(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addReaction({
        variables: { reactionBody, mediaId }
      });

      // clear form value
      setBody('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Container>
        <p
          className={`m-0 ${
            characterCount === 280 || error ? 'text-error' : ''
          }`}
        >
          Character Count: {characterCount}/280
          {error && <span className='ml-2'>Something went wrong...</span>}
        </p>
        <Container>
          <form onSubmit={handleFormSubmit}>
            <TextField
              placeholder='Leave a reaction to this thought...'
              value={reactionBody}
              onChange={handleChange}
            ></TextField>
            <br></br>
            <Button type='submit'>Submit</Button>
          </form>
        </Container>
        {error && <div>Something went wrong...</div>}
      </Container>
    </div>
  );
};

export default ReactionForm;
