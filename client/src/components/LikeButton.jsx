import React, { useState } from "react";
import { likePost, unlikePost } from "../api/postApi";

// Replace this with your actual logged-in user logic
const mockUserId = "user123";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);

  const handleToggleLike = async () => {
    try {
      if (liked) {
        await unlikePost(postId, mockUserId);
        setLiked(false);
      } else {
        await likePost(postId, mockUserId);
        setLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`text-sm px-3 py-1 rounded ${
        liked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      {liked ? "👍 Liked" : "👍 Like"}
    </button>
  );
};

export default LikeButton;
