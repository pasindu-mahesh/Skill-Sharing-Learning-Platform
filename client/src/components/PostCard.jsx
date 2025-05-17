import React, { useState, useEffect, useRef } from "react";
import CommentBox from "./CommentBox"; // Ensure path is correct
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, Avatar, Typography, Stack, Box, TextField, Button, Tooltip } from "@mui/material";

const PostCard = () => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  const currentUser = {
    id: "currentUser",
    username: "paula_johnson83"
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white border rounded-md shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center p-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h3 className="text-sm font-semibold">{currentUser.username}</h3>
          <p className="text-xs text-gray-500">Altadena, California</p>
        </div>
      </div>

      {/* Post Image */}
      <div
        className="w-full h-[350px] bg-center bg-cover"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')",
        }}
      />

      {/* Action Buttons */}
      <div className="flex items-center text-xl px-4 py-2">
        <span role="img" aria-label="heart">❤️</span>
        <span className="ml-1 mr-4 text-base">1</span>
        <button onClick={handleToggleComments} className="flex items-center">
          <span role="img" aria-label="comment">💬</span>
        </button>
        <span className="ml-1 mr-4 text-base">3</span>
        <span className="flex-grow" />
        <Tooltip title="Share">
          <IconButton 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this post',
                  text: 'Shared from Skill Sharing App',
                  url: window.location.href
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            sx={{
              color: 'inherit',
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Likes */}
      <div className="px-4 text-sm font-semibold">532 Likes</div>

      {/* Caption */}
      <div className="px-4 py-2 text-sm">
        <span className="font-semibold mr-1">{currentUser.username}</span>
        lorem ipsum dolor sit amet
      </div>

      {/* Hashtags */}
      <div className="px-4 pb-4 text-xs text-blue-600 flex flex-wrap gap-x-2">
        <span>#augue</span>
        <span>#adipiscing</span>
        <span>#elit</span>
        <span>#do</span>
        <span>#eiusmod</span>
        <span>#tempor</span>
      </div>

      {/* Toggleable Comment Section */}
      {showComments && (
        <div className="px-4 pb-4">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Avatar>{currentUser.username[0].toUpperCase()}</Avatar>
            <Typography variant="subtitle2">
              Commenting as <strong>{currentUser.username}</strong>
            </Typography>
          </Stack>
          <div className="relative flex items-center gap-2 mb-2">
            <input
              type="text"
              className="w-full border rounded-full px-4 py-2 text-sm"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
              <InsertEmoticonIcon />
            </IconButton>
            {showEmojiPicker && (
              <div ref={emojiRef} className="absolute z-50 bottom-12 right-0">
                <EmojiPicker onEmojiClick={handleEmojiClick} height={320} width={280} />
              </div>
            )}
          </div>
          <CommentBox postId="123" />
        </div>
      )}
    </div>
  );
};

export default PostCard;
