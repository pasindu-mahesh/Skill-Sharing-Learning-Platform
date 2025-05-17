import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

  // Check initial follow status
  React.useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser?.id || !user?.id) return;
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
        setIsFollowing(followingIds.includes(user.id));
      } catch (error) {
        toast.error("Couldn't verify follow status");
      } finally {
        setIsInitializing(false);
      }
    };
    checkFollowStatus();
  }, [currentUser?.id, user?.id]);

  const handleFollowAction = async (action) => {
    setIsProcessing(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const endpoint = `http://localhost:8080/api/follows/${currentUser.id}/${action}/${user.id}`;
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
      toast.success(action === "follow" 
        ? `Following ${user.username}` 
        : `Unfollowed ${user.username}`);
    } catch (error) {
      toast.error(error.message);
      setIsFollowing(prev => !prev);
    } finally {
      setIsProcessing(false);
    }
  };

  // Modern loading skeleton
  if (isInitializing) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md mb-6 mx-auto w-full max-w-xl p-6 flex items-center gap-4 animate-pulse">
        <div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-16 w-16"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md mb-6 mx-auto w-full max-w-xl flex items-center gap-6 p-6 hover:shadow-xl transition-shadow border border-zinc-100 dark:border-zinc-800">
      <div className="relative">
        <img
          src={user.profilePictureUrl || "/default-avatar.png"}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover border-4 border-primary shadow-sm"
        />
        {isFollowing && (
          <span className="absolute bottom-0 right-0 block w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full shadow"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold truncate capitalize">
            {user.firstName} {user.lastName}
          </h3>
          <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
        </div>
        {user.bio && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 truncate">{user.bio}</p>
        )}
      </div>
      {currentUser?.id !== user.id && (
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
  );
};

export default UserCard;
