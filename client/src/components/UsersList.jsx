import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserCard from "./UserCard";

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
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

  if (loading) return <div className="text-center py-10 text-lg">Loading users...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/30">

      <div className="w-full max-w-2xl flex flex-col items-center">
        {users.map(u => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
};

export default UsersList;
