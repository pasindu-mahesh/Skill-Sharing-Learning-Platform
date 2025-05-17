import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserCard from "./UserCard";

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/profiles", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.filter(profile => profile.id !== user?.id));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(user => {
    const searchString = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchString) ||
      user.firstName?.toLowerCase().includes(searchString) ||
      user.lastName?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString)
    );
  });

  if (loading) return <div className="text-center py-10 text-lg">Loading users...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/30 pt-12">
      <div className="w-full max-w-2xl flex flex-col items-center p-4">
        {/* Search Bar */}
        <div className="w-full mb-6">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No users found matching your search
          </div>
        ) : (
          filteredUsers.map(u => (
            <UserCard key={u.id} user={u} />
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
