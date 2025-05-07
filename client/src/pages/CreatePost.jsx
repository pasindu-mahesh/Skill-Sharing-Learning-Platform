import React, { useState, useRef, useEffect } from "react";
import { createPost } from "../api/postApi";
import { validateMediaFiles } from "../utils/mediaValidation";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { IconButton } from "@mui/material";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [media, setMedia] = useState([]);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [postType, setPostType] = useState("");
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (postType === "photo") {
      if (!files.every((file) => file.type.startsWith("image/"))) {
        setError("Only images are allowed for Photo posts.");
        return;
      }
    }

    if (postType === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          setError("Video must be less than 30 seconds.");
        } else {
          setMedia(files);
          setPreview([URL.createObjectURL(files[0])]);
          setError("");
        }
      };
      video.src = URL.createObjectURL(files[0]);
      return;
    }

    const validation = validateMediaFiles(files);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setMedia(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !category || media.length === 0 || !postType) {
      setError("Please fill all fields and upload appropriate media.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("category", category);
    media.forEach((file, index) => {
      formData.append(`media${index + 1}`, file);
    });

    try {
      await createPost(formData);
      setSuccess("Post created successfully!");
      setDescription("");
      setCategory("");
      setMedia([]);
      setPreview([]);
      setPostType("");
      setShowOtherOptions(false);
    } catch {
      setError("Failed to create post. Please try again.");
    }
  };

  const handleEmojiClick = (emoji) => {
    setDescription((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Create Skill-Sharing Post</h2>

      {/* Post Type Selection */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setPostType("photo"); setMedia([]); setPreview([]); setError(""); }} className={`px-4 py-2 rounded border ${postType === "photo" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>📸 Photo Post</button>
        <button onClick={() => { setPostType("video"); setMedia([]); setPreview([]); setError(""); }} className={`px-4 py-2 rounded border ${postType === "video" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>🎥 Video Post</button>
      </div>

      {/* Other Options */}
      <button onClick={() => setShowOtherOptions(!showOtherOptions)} className="mb-4 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300">➕ Other Options</button>
      {showOtherOptions && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {["Tag people", "GIF", "Feeling", "Location", "Life Event"].map((option) => (
            <button key={option} className="bg-gray-100 p-2 rounded shadow text-sm">{option}</button>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded resize-none"
            rows={4}
            placeholder="What's your skill or tip?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <IconButton
            size="small"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            sx={{ position: "absolute", bottom: 10, right: 10 }}
          >
            <InsertEmoticonIcon />
          </IconButton>
          {showEmojiPicker && (
            <div ref={emojiRef} className="absolute z-10 right-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select a category</option>
          <option value="Coding">Coding</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
        </select>

        {postType && (
          <input
            type="file"
            multiple={postType === "photo"}
            accept={postType === "photo" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        )}

        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {preview.map((url, i) => (
              <div key={i}>
                {postType === "video" ? (
                  <video src={url} controls className="rounded w-full h-28 object-cover" />
                ) : (
                  <img src={url} alt={`preview-${i}`} className="rounded w-full h-28 object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
