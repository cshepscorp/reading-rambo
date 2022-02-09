import React, { useState } from "react";
import "./style.css";
import { useMutation } from "@apollo/client";
import { ADD_REACTION } from "../../utils/mutations";
import { QUERY_SINGLE_MEDIA } from "../../utils/queries";
import { Button, Container, TextField } from "@mui/material";

const ReactionForm = ({ mediaId }) => {
  const [reactionBody, setBody] = useState("");
  // state change for how many characters are written in the text field
  const [characterCount, setCharacterCount] = useState(0);
  // const [addReaction, { error }] = useMutation(ADD_REACTION);
  const [addReaction, { error }] = useMutation(ADD_REACTION, {
    update(cache, { data: { addReaction } }) {
      try {
        // update reaction array's cache
        // could potentially not exist yet, so wrap in a try/catch
        const { media } = cache.readQuery({
          query: QUERY_SINGLE_MEDIA,
          variables: { mediaId },
        });

        console.log("=====media from mutation");
        console.log(media);
        const reactions = media.reactions;
        console.log("=====reactions");
        console.log(reactions);
        cache.writeQuery({
          query: QUERY_SINGLE_MEDIA,
          data: { media: {...media, reactions: [addReaction, ...reactions]} },
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
        <form onSubmit={handleFormSubmit}>
          <TextField
            id="reaction-text-field"
            multiline
            maxRows={6}
            placeholder="Leave a reaction to this thought..."
            value={reactionBody}
            onChange={handleChange}
          ></TextField>
          <br></br>
          <Button id="react-submit" type="submit">
            Submit
          </Button>
        </form>
        {error && <div>Something went wrong...</div>}
      </Container>
    </div>
  );
};

export default ReactionForm;
