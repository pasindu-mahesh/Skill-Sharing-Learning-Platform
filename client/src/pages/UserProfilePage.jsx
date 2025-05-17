import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const samplePosts = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/400?random=${i + 1}`,
  caption: `Sample post ${i + 1}`,
  likes: Math.floor(Math.random() * 100),
  comments: [
    { id: 1, user: "alice", text: "Nice shot!" },
    { id: 2, user: "bob", text: "Love this!" },
  ].slice(0, Math.floor(Math.random() * 3)),
}));

const InstagramPost = ({ post, onLike, onAddComment, isLiked }) => {
  const [comment, setComment] = useState("");
  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-sm flex flex-col">
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-4 mb-2">
          <button
            aria-label="Like"
            onClick={() => onLike(post.id)}
            className="focus:outline-none"
          >
            {isLiked ? (
              <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [posts, setPosts] = useState(samplePosts);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8080/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser?.id || !id || currentUser.id === id) {
        setIsInitializing(false);
        return;
      }
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:8080/api/follows/${currentUser.id}/following`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!response.ok) throw new Error("Failed to check follow status");
        const followingIds = await response.json();
        setIsFollowing(followingIds.includes(id));
      } catch (error) {
        toast.error("Couldn't verify follow status");
      } finally {
        setIsInitializing(false);
      }
    };
    checkFollowStatus();
  }, [currentUser?.id, id]);

  const handleFollowAction = async (action) => {
    setIsProcessing(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const endpoint = `http://localhost:8080/api/follows/${currentUser.id}/${action}/${id}`;
      const response = await fetch(endpoint, {
        method: action === "follow" ? "POST" : "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action}`);
      }
      setIsFollowing(action === "follow");
      toast.success(
        action === "follow"
          ? `Following ${profile?.username || ""}`
          : `Unfollowed ${profile?.username || ""}`
      );
    } catch (error) {
      toast.error(error.message);
      setIsFollowing((prev) => !prev);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + (likedPosts.includes(postId) ? -1 : 1) } : post
      )
    );
    setLikedPosts(liked =>
      liked.includes(postId) ? liked.filter(id => id !== postId) : [...liked, postId]
    );
  };

  const handleAddComment = (postId, commentText) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === postId ? {
          ...post,
          comments: [...post.comments, { id: post.comments.length + 1, user: currentUser?.username || "You", text: commentText }]
        } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="animate-pulse h-40 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return <div className="max-w-xl mx-auto mt-10">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="bg-secondary/50 rounded-xl shadow-md p-6 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <img
            src={profile.profilePictureUrl || "/default-avatar.png"}
            alt={profile.username}
            className="w-20 h-20 rounded-full object-cover border-4 border-primary"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="text-muted-foreground">@{profile.username}</div>
            <div className="text-sm text-zinc-600 mt-2">{profile.bio}</div>
            <div className="flex gap-4 mt-3">
              <span><b>{profile.followers}</b> Followers</span>
              <span><b>{profile.following}</b> Following</span>
            </div>
          </div>
          {currentUser?.id !== id && !isInitializing && (
            <Button
              variant={isFollowing ? "secondary" : "default"}
              onClick={() => handleFollowAction(isFollowing ? "unfollow" : "follow")}
              disabled={isProcessing}
              size="lg"
              className={`rounded-full px-6 font-semibold transition-all duration-200 ${
                isFollowing
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isProcessing ? (
                <span className="animate-spin">↻</span>
              ) : isFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <InstagramPost
              key={post.id}
              post={post}
              onLike={handleLike}
              onAddComment={handleAddComment}
              isLiked={likedPosts.includes(post.id)}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No posts available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;