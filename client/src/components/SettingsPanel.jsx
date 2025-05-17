import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

const SettingsPanel = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // MOVED HERE: at the top level of component
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    website: "",
  });

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8080/api/profiles/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data = await response.json();
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        website: data.website || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

const handlePasswordUpdate = async (e) => {
  e.preventDefault();

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("New passwords don't match");
    return;
  }

  setIsSaving(true);
  try {
    const accessToken = localStorage.getItem("accessToken");
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!accessToken || !supabaseAnonKey) {
      throw new Error("Missing access token or API key");
    }

    const response = await fetch("https://ysamcituxmazujhnmuhd.supabase.co/auth/v1/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ password: passwordData.newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error_description || "Failed to update password");
    }

    toast.success("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  } catch (error) {
    console.error("Password update error:", error);
    toast.error(error.message);
  } finally {
    setIsSaving(false);
  }
};





  const handleSaveChanges = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/api/profiles/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            website: formData.website,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Settings saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
  setDeleting(true);
  try {
    const accessToken = localStorage.getItem("accessToken");

    // Delete profile first to avoid foreign key constraint error
    const profileResponse = await fetch(
      `http://localhost:8080/api/profiles/${user.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!profileResponse.ok) throw new Error("Profile deletion failed");

    // Then delete auth user
    const authResponse = await fetch(
      `http://localhost:8080/api/auth/users/${user.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!authResponse.ok) throw new Error("Authentication deletion failed");

    // Sign out using Supabase
    await supabase.auth.signOut();

    // Clear local data and redirect
    localStorage.removeItem("accessToken");
    navigate("/login");
    toast.success("Account deleted successfully!");

  } catch (error) {
    toast.error(error.message);
  } finally {
    setDeleting(false);
    setShowDeleteConfirm(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-background w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
            </svg>
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <Accordion type="single" collapsible defaultValue="account" className="w-full">
                  <AccordionItem value="account">
                    <AccordionTrigger className="text-lg">Account Settings</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy">
                    <AccordionTrigger className="text-lg">Privacy</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Private Account</p>
                          <p className="text-sm text-muted-foreground">
                            When your account is private, only people you approve can see your photos
                          </p>
                        </div>
                        <Switch id="private-account" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activity Status</p>
                          <p className="text-sm text-muted-foreground">
                            Allow accounts you follow to see when you're active
                          </p>
                        </div>
                        <Switch id="activity-status" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Photo Location</p>
                          <p className="text-sm text-muted-foreground">
                            Show photo location information on your profile
                          </p>
                        </div>
                        <Switch id="photo-location" defaultChecked />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications">
                    <AccordionTrigger className="text-lg">Notifications</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <Switch id="push-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Follower Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone follows you
                          </p>
                        </div>
                        <Switch id="follower-notifications" defaultChecked />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Password Update Form */}
                <form onSubmit={handlePasswordUpdate} className="pt-6 border-t">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="security">
                      <AccordionTrigger className="text-lg">Security</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                       <Button
                          type="button"        // Change to button to prevent form submit bubbling
                          onClick={handlePasswordUpdate}
                          disabled={isSaving}
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                        >
                          {isSaving ? "Updating..." : "Update Password"}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </form>

                {/* Delete Account Section */}
                <div className="pt-8 border-t">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSaving}
                  >
                    Delete Account
                  </Button>
                </div>

                <div className="pt-4 border-t flex justify-between">
                  <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">Confirm Account Deletion</h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
