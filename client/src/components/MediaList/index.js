import React from "react";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';

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
                <Link to={`/media/${media.mediaId}`}><img
                  className="feed-image"
                  src={media.image}
                  alt={`The main graphic for ${media.title}`}
                /></Link>
              ) : null}
              <div className="card-body">
                <Link to={`/media/${media.mediaId}`}>
                  <p>{media.title}</p>
                  {/* <p className="mb-0">
                  Reactions: {media.reactionCount} || Click to{" "}
                  {media.reactionCount ? "see" : "start"} the discussion!
                </p> */}
                </Link>
                {/* <Link
                    to={`/profile/${media.username}`}
                    style={{ fontWeight: 300 }}
                    className="text-light"
                  >
                    {media.username}
                    
                  </Link>{" "} */}
                {/* <p class="card-text">
                added {media.createdAt}
                </p> */}
                {Auth.loggedIn() && (<Link
                      to={`/media/${media.mediaId}`}
                      style={{ fontWeight: 300 }}
                      className="text-light"
                    >
                      Add to the convo...
                    </Link>)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MediaList;
