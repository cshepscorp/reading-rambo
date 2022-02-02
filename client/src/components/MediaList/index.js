import React from "react";
import { Link } from "react-router-dom";

const MediaList = ({ medias, title }) => {
  if (!medias.length) {
    return <h3>No Lists Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <div className="cardHolder">
        {medias &&
          medias.map((media) => (
            <div key={media._id} className="card mb-3">
              {media.image ? (
                <img
                  src={media.image}
                  alt={`The main graphic for ${media.title}`}
                  variant="top"
                />
              ) : null}
              <div className="card-body">
                <Link to={`/media/${media._id}`}>
                  <p>{media.title}</p>
                  {/* <p className="mb-0">
                  Reactions: {media.reactionCount} || Click to{" "}
                  {media.reactionCount ? "see" : "start"} the discussion!
                </p> */}
                </Link>
                <p className="card-body">
                  <Link
                    to={`/profile/${media.username}`}
                    style={{ fontWeight: 300 }}
                    className="text-light"
                  >
                    {media.username}
                  </Link>{" "}
                  added by {media.createdAt} on {media.createdAt}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MediaList;
