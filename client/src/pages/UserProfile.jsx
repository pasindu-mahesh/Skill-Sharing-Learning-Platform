import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SettingsPanel from "@/components/SettingsPanel";
import ImageUploader from "@/components/ImageUploader";
import PhotoCard from "@/components/PhotoCard";

const UserProfile = () => {
  // Profile state
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=500&auto=format&fit=crop&q=60");
  const [bio, setBio] = useState("Professional photographer specializing in landscape and wildlife photography. Based in New York. Available for bookings worldwide.");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState(bio);
  const [isFollowing, setIsFollowing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock data
  const followerCount = 1452;
  const followingCount = 387;
  const postCount = 127;

  // Mock top posts
  const topPosts = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60",
      title: "Mountain Sunrise",
      likes: 328,
      comments: 42,
      isLiked: true
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60",
      title: "Forest Reflections",
      likes: 245,
      comments: 23,
      isLiked: false
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&auto=format&fit=crop&q=60",
      title: "Golden Hour Trees",
      likes: 198,
      comments: 17,
      isLiked: true
    }
  ];

  // More posts
  const allPosts = [
    ...topPosts,
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1541173109020-9c5d8a48e169?w=500&auto=format&fit=crop&q=60",
      title: "Japanese Garden",
      likes: 156,
      comments: 14,
      isLiked: false
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1561571994-3c61c554181a?w=500&auto=format&fit=crop&q=60",
      title: "Desert Sunset",
      likes: 142,
      comments: 19,
      isLiked: false
    },
    {
      id: "6",
      imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=500&auto=format&fit=crop&q=60",
      title: "Mountain Lake",
      likes: 138,
      comments: 11,
      isLiked: true
    }
  ];

  // Handlers
  const handleSaveBio = () => {
    setBio(draftBio);
    setIsEditingBio(false);
    toast.success("Bio updated successfully");
  };

  const handleCancelEditBio = () => {
    setDraftBio(bio);
    setIsEditingBio(false);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed user" : "Now following user");
  };

  const toggleSettingsPanel = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-background rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <ImageUploader
              currentImage={profileImage}
              onChange={setProfileImage}
              className="w-32 h-32 md:w-40 md:h-40"
            />

            {/* Profile Info */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">John Doe</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" size="sm">Message</Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={toggleSettingsPanel}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <span className="font-bold">{postCount}</span>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">{followerCount}</span>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">{followingCount}</span>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>

              {/* Bio */}
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Bio</h2>
                  {!isEditingBio && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingBio(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
                
                {isEditingBio ? (
                  <div className="space-y-2">
                    <Textarea
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      placeholder="Tell others about yourself..."
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancelEditBio}>Cancel</Button>
                      <Button size="sm" onClick={handleSaveBio}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">{bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="top">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="top">Top Posts</TabsTrigger>
              <TabsTrigger value="all">All Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {topPosts.map(post => (
                  <PhotoCard
                    key={post.id}
                    id={post.id}
                    imageUrl={post.imageUrl}
                    title={post.title}
                    likes={post.likes}
                    comments={post.comments}
                    isLiked={post.isLiked}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allPosts.map(post => (
                  <PhotoCard
                    key={post.id}
                    id={post.id}
                    imageUrl={post.imageUrl}
                    title={post.title}
                    likes={post.likes}
                    comments={post.comments}
                    isLiked={post.isLiked}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default UserProfile;