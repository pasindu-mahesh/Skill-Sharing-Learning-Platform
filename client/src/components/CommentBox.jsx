import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiPicker from "emoji-picker-react";
import { getComments, addComment, deleteComment } from "../api/postApi";

const mockUserId = "user123"; // Simulated logged-in user

const CommentBox = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiWrapperRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await getComments(postId);
        setComments(res.data);
      } catch (err) {
        setError("Failed to load comments.");
      }
    };
    loadComments();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiWrapperRef.current && !emojiWrapperRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(postId, commentText, mockUserId);
      setCommentText("");
      const res = await getComments(postId);
      setComments(res.data);
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId, userId) => {
    if (userId !== mockUserId) return;
    try {
      await deleteComment(commentId);
      const res = await getComments(postId);
      setComments(res.data);
    } catch (err) {
      setError("Failed to delete comment.");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Comments
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
        }}
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          position: "relative",
          mb: 3
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#fff',
            }
          }}
        />
        <IconButton
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          sx={{ color: theme.palette.primary.main }}
        >
          <InsertEmoticonIcon />
        </IconButton>

        {showEmojiPicker && (
          <div
            ref={emojiWrapperRef}
            style={{
              position: "absolute",
              bottom: "50px",
              right: 0,
              zIndex: 10,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} height={300} width={280} />
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!commentText.trim()}
          sx={{
            borderRadius: 4,
            fontWeight: 500,
            textTransform: "none",
            px: 3,
            py: 1,
            minWidth: 80,
          }}
        >
          Post
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2, fontSize: 14 }}>{error}</Typography>
      )}

      <List>
        {comments.map((comment) => (
          <ListItem
            key={comment.id}
            secondaryAction={
              comment.userId === mockUserId && (
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleDeleteComment(comment.id, comment.userId)}
                >
                  Delete
                </Button>
              )
            }
            sx={{
              backgroundColor: theme.palette.grey[100],
              mb: 1,
              borderRadius: 2
            }}
          >
            <ListItemText primary={comment.content} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommentBox;
