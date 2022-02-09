import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_REACTION } from "../../utils/mutations";
import { Button, Container, TextField } from "@mui/material";

import { QUERY_SINGLE_MEDIA } from "../../utils/queries";

const ReactionForm = ({ mediaId }) => {
  const [reactionBody, setBody] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  //const [addReaction, { error }] = useMutation(ADD_REACTION);

  const [addReaction, { error }] = useMutation(ADD_REACTION, {
    update(cache, { data: { addReaction } }) {
      try {
        // update reaction array's cache
        // could potentially not exist yet, so wrap in a try/catch
        const { media } = cache.readQuery({
          query: QUERY_SINGLE_MEDIA,
          variables: { mediaId },
        });
        // console.log("=====mediaId from mutation");
        // console.log(mediaId);
        console.log("=====media from mutation");
        console.log(media);
        cache.writeQuery({
          query: QUERY_SINGLE_MEDIA,
          data: { media: [addReaction, ...media] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

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
        variables: { reactionBody, mediaId },
      });

      // clear form value
      setBody("");
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
            characterCount === 280 || error ? "text-error" : ""
          }`}
        >
          Character Count: {characterCount}/280
          {error && <span className="ml-2">Something went wrong...</span>}
        </p>
        <Container>
          <form onSubmit={handleFormSubmit}>
            <TextField
              placeholder="Leave a reaction to this thought..."
              value={reactionBody}
              onChange={handleChange}
            ></TextField>
            <br></br>
            <Button type="submit">Submit</Button>
          </form>
        </Container>
        {error && <div>Something went wrong...</div>}
      </Container>
    </div>
  );
};

export default ReactionForm;
