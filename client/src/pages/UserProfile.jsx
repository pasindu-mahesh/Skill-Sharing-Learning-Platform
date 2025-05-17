import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SettingsPanel from "@/components/SettingsPanel";
import ImageUploader from "@/components/ImageUploader";
import PhotoCard from "@/components/PhotoCard";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

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
    phone: ""
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch profile info (with access token)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/api/profiles/${user.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
          phone: data.phone || ""
        });
        setDraftBio(data.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [user]);

  // Handle profile picture upload
  const handleImageUpload = async (file) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:8080/api/profiles/${user.id}/picture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update profile picture");

      const updatedProfile = await response.json();
      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: updatedProfile.profilePictureUrl
      }));

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleSaveBio = () => {
    setProfileData(prev => ({ ...prev, bio: draftBio }));
    setIsEditingBio(false);
    toast.success("Bio updated successfully");
  };

  const displayName = () => {
    if (profileData.firstName || profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`.trim();
    }
    return profileData.username || "Loading...";
  };

  // --- UI ---
  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <ImageUploader
              currentImage={profileData.profilePictureUrl}
              onChange={handleImageUpload}
              className="w-32 h-32 md:w-40 md:h-40"
            />

            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{displayName()}</h1>
                  {profileData.username && (
                    <p className="text-muted-foreground">@{profileData.username}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" size="sm">Message</Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <span className="font-bold">127</span>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">{profileData.followers}</span>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <span className="font-bold">{profileData.following}</span>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>

              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Bio</h2>
                  {/* {!isEditingBio && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBio(true)}
                    >
                      Edit
                    </Button>
                  )} */}
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
                      <Button variant="outline" size="sm" onClick={() => setIsEditingBio(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveBio}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{profileData.bio || "No bio yet"}</p>
                    <div className="flex flex-wrap gap-4">
                      {profileData.website && (
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Website
                        </a>
                      )}
                      {profileData.email && (
                        <span className="text-muted-foreground">
                          {profileData.email}
                        </span>
                      )}
                      {profileData.phone && (
                        <span className="text-muted-foreground">
                          {profileData.phone}
                        </span>
                      )}
                    </div>
                  </div>
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
            {/* Tabs content remains the same */}
          </Tabs>
        </div>
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default UserProfile;
