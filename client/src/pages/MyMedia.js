import React from "react";

import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_MEDIA } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { removeMediaId } from "../utils/localStorage";

const MyMedia = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];
  console.log("=======ME DATA======");

  const [removeMedia] = useMutation(REMOVE_MEDIA);

  const handleDeleteMedia = async (mediaId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeMedia({
        variables: { mediaId: mediaId },
      });

      removeMediaId(mediaId);
    } catch (e) {
      console.error(e);
    }
  };

  // if no data say so
  if (loading) {
    return <h2>Loading data...</h2>;
  }

  console.log(userData);

  return (
    <main>
      <div>
        <h1>your saved shows / movies</h1>
      </div>
      <div>
        <h2>
          {`Viewing ${userData.mediaCount} saved ${
            userData.mediaCount === 1 ? "item" : "items"
          }:`}
        </h2>
        <div>
          <div className="cardHolder">
            {userData.savedMedia.map((media) => {
              return (
                <div className="card" key={media.mediaId} border="dark">
                  {media.image ? (
                    <img
                      src={media.image}
                      alt={`The main graphic for ${media.title}`}
                      variant="top"
                    />
                  ) : null}
                  <div>
                    <p>{media.title}</p>
                    {media.year ? (
                      <p className="small">Year: {media.year}</p>
                    ) : null}
                    {media.stars ? (
                      <p className="small">Starring: {media.stars}</p>
                    ) : null}
                    {media.description ? (
                      <p className="small">Description: {media.description}</p>
                    ) : null}
                    {media.link ? <p className="small">{media.link}</p> : null}
                    <button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteMedia(media.mediaId)}
                    >
                      Delete this item!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyMedia;
