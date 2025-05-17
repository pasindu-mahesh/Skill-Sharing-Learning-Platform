import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // <-- Import Auth Context

// Sample post data
const samplePosts = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/400?random=${i + 1}`,
  caption: `Sample post ${i + 1}`
}));

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth(); // <-- Get logged-in user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch profile info
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

  // Check follow status
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

  // Handle follow/unfollow
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

  return (    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
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
          {/* Follow/Unfollow Button */}
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

      {/* Posts Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {samplePosts.map((post) => (
            <div 
              key={post.id}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden group relative"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 text-center p-2">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {samplePosts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No posts available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
