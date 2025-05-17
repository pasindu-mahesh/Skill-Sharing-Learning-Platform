import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const InstagramPost = ({ post, onLike, onAddComment, isLiked }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-sm flex flex-col mb-6">
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="w-full h-80 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-4 mb-2">
          <button
            aria-label="Like"
            onClick={() => onLike(post.id)}
            className="focus:outline-none"
          >
            {isLiked ? (
              <svg
                className="w-6 h-6 text-red-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
          <span className="font-semibold">{post.likes} likes</span>
          <span className="ml-4 text-muted-foreground">{post.caption}</span>
        </div>
        <div className="mb-2">
          {post.comments.map((c) => (
            <div key={c.id} className="text-sm text-muted-foreground mb-1">
              <span className="font-semibold">{c.user}: </span>
              {c.text}
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) {
              onAddComment(post.id, comment);
              setComment("");
            }
          }}
        >
          <Textarea
            className="flex-1 min-h-[32px] max-h-[64px] resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={1}
          />
          <Button type="submit" size="sm" disabled={!comment.trim()}>
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InstagramPost;