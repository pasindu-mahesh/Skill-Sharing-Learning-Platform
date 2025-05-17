import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SettingsPanel from "@/components/SettingsPanel";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import InstagramPost from "@/components/InstergramPost";

const UserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    profilePictureUrl: "",
    bio: "",
    firstName: "",
    lastName: "",
    username: "",
    followers: 0,
    following: 0,
    website: "",
    email: "",
    phone: "",
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/api/profiles/${user.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData({
          profilePictureUrl: data.profilePictureUrl || "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e",
          bio: data.bio || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          username: data.username || "",
          followers: data.followers || 0,
          following: data.following || 0,
          website: data.website || "",
          email: data.email || "",
          phone: data.phone || "",
        });
        setDraftBio(data.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile data");
      }
    };

    const fetchPosts = async () => {
      const demoPosts = Array.from({ length: 9 }).map((_, i) => ({
        id: i + 1,
        imageUrl: `https://picsum.photos/400?random=${i + 1}`,
        caption: `Sample post ${i + 1}`,
        likes: Math.floor(Math.random() * 100),
        comments: [
          { id: 1, user: "alice", text: "Nice shot!" },
          { id: 2, user: "bob", text: "Love this!" },
        ].slice(0, Math.floor(Math.random() * 3)),
      }));
      setPosts(demoPosts);
    };

    fetchProfile();
    fetchPosts();
  }, [user]);

  const handleImageUpload = async (file) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`http://localhost:8080/api/profiles/${user.id}/picture`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update profile picture");
      const updatedProfile = await response.json();
      setProfileData((prev) => ({ ...prev, profilePictureUrl: updatedProfile.profilePictureUrl }));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleSaveBio = () => {
    setProfileData((prev) => ({ ...prev, bio: draftBio }));
    setIsEditingBio(false);
    toast.success("Bio updated successfully");
  };

  const displayName = () => {
    return `${profileData.firstName} ${profileData.lastName}`.trim() || profileData.username || "Loading...";
  };

  const handleLike = (postId) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + (likedPosts.includes(postId) ? -1 : 1) } : post
      )
    );
    setLikedPosts((liked) =>
      liked.includes(postId) ? liked.filter((id) => id !== postId) : [...liked, postId]
    );
  };

  const handleAddComment = (postId, commentText) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: post.comments.length + 1, user: user?.username || "You", text: commentText }],
            }
          : post
      )
    );
  };

  const topPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-b from-primary/10 to-secondary/30 backdrop-blur-lg">
      <div className="container mx-auto px-2 pt-12 pb-6 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-md rounded-xl px-6 pt-4 pb-6 shadow border border-white/30">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
            <ImageUploader
              currentImage={profileData.profilePictureUrl}
              onChange={handleImageUpload}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-primary"
            />
            <div className="flex-1 w-full text-center md:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{displayName()}</h1>
              {profileData.username && <p className="text-muted-foreground text-sm">@{profileData.username}</p>}
              <div className="flex justify-center md:justify-start gap-4 text-center mt-2">
                <div><span className="font-bold">{posts.length}</span><p className="text-sm text-muted-foreground">Posts</p></div>
                <div><span className="font-bold">{profileData.followers}</span><p className="text-sm text-muted-foreground">Followers</p></div>
                <div><span className="font-bold">{profileData.following}</span><p className="text-sm text-muted-foreground">Following</p></div>
              </div>
              <div className="flex justify-center md:justify-start gap-2 mt-2">
                <Button variant="outline" size="sm">Message</Button>
                <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>⚙️</Button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center md:text-left">
            <h2 className="text-lg font-medium mb-1">Bio</h2>
            {isEditingBio ? (
              <div className="space-y-2">
                <Textarea
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingBio(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveBio}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground">{profileData.bio || "No bio yet"}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {profileData.website && <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Website</a>}
                  {profileData.email && <span className="text-muted-foreground">{profileData.email}</span>}
                  {profileData.phone && <span className="text-muted-foreground">{profileData.phone}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="top">
            <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-6">
              <TabsTrigger value="top">Top Posts</TabsTrigger>
              <TabsTrigger value="all">All Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="top">
              <h3 className="text-xl font-semibold mb-4">Top Posts</h3>
              {topPosts.length === 0 ? (
                <div className="text-center text-muted-foreground">No top posts yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {topPosts.map(post => (
                    <InstagramPost key={post.id} post={post} onLike={handleLike} onAddComment={handleAddComment} isLiked={likedPosts.includes(post.id)} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="all">
              <h3 className="text-xl font-semibold mb-4">All Photos</h3>
              {posts.length === 0 ? (
                <div className="text-center text-muted-foreground">No posts yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {posts.map(post => (
                    <InstagramPost key={post.id} post={post} onLike={handleLike} onAddComment={handleAddComment} isLiked={likedPosts.includes(post.id)} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default UserProfile;