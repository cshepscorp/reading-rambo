import React, { useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
// import ReactionList from "../../components/ReactionList";
// import ReactionForm from "../../components/ReactionForm";
import { ADD_REACTION } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_MEDIA } from "../../utils/queries";
import { Card, Container, TextField, Button } from "@mui/material";

const SingleMedia = (props) => {
  const { id: mediaId } = useParams();
  console.log(mediaId);
  const { loading, data } = useQuery(QUERY_SINGLE_MEDIA, {
    variables: { mediaId: mediaId },
  });
  console.log(data);
  const media = data?.media || {};
  console.log("media results");
  console.log(media);
  const reactions = media.reactions;
  console.log("reactions");
  console.log(reactions);

  // reaction stuff
  const [reactionBody, setBody] = useState("");
  // state change for how many characters are written in the text field
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

        console.log("=====media from mutation");
        console.log(media);
        const reactions = media.reactions;
        console.log("=====reactions from media");
        console.log(reactions);

        cache.writeQuery({
          query: QUERY_SINGLE_MEDIA,
          //data: { media: [addReaction, ...media] },
          variables: { mediaId },
          data: { media: { ...media, reactions: [addReaction, ...reactions] } },
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        {media.image ? (
          <img
            className="single-media-image"
            src={media.image}
            alt={`The main graphic for ${media.title}`}
          />
        ) : null}
        <p className="small">
          added by{" "}
          <Link
            to={`/profile/${media.username}`}
            style={{ fontWeight: 300 }}
            className="text-light"
          >
            {media.username}
          </Link>{" "}
          at {media.createdAt}
        </p>
        <div className="card-body">
          <p>{media.title}</p>
          {media.year ? <p>{media.year}</p> : null}
          {media.description ? <p>{media.description}</p> : null}
          {media.stars ? <p>Starring: {media.stars}</p> : null}
          {media.authors ? <p>{media.authors}</p> : null}

          <p>{`${media.reactionCount} ${
            media.reactionCount === 1 ? "reaction" : "reactions"
          }!`}</p>
        </div>
      </Card>
      <Card>
        <div className="card mb-3">
          <div className="card-header">
            <p className="text-light">Join in on the convo!</p>
          </div>
          <div className="card-body">
            {reactions &&
              reactions.map((reaction) => (
                <p className="pill mb-3" key={reaction._id}>
                  {reaction.reactionBody} {" ---> "}
                  <Link
                    to={`/profile/${reaction.username}`}
                    style={{ fontWeight: 700 }}
                  >
                    {reaction.username} on {reaction.createdAt}
                  </Link>
                </p>
              ))}
          </div>
        </div>
      </Card>
      {Auth.loggedIn() ? (
        <Card>
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
        </Card>
      ) : null}
    </Container>
    //  {/* {Auth.loggedIn() && <ReactionForm mediaId={media.mediaId} />} */}
  );
};

export default SingleMedia;
