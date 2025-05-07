import React, { useEffect, useState } from "react";
import { getPosts } from "../api/postApi";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

const dummyStories = [
  { id: 1, name: "Tom Russo", image: "/stories/story1.jpg" },
  { id: 2, name: "Betty Chen", image: "/stories/story2.jpg" },
  { id: 3, name: "Dennis Han", image: "/stories/story3.jpg" },
  { id: 4, name: "Cynthia Lopez", image: "/stories/story4.jpg" },
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState(dummyStories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar (fixed) */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md z-10 overflow-y-auto hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 mt-[64px] p-6">
        {/* Stories */}
        <div className="flex overflow-x-auto gap-4 p-4 border-b border-gray-300 bg-white rounded">
          <div className="flex-shrink-0 w-20 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer text-gray-500 text-3xl">
              +
            </div>
            <p className="text-xs mt-1">Add Story</p>
          </div>

          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 w-20 text-center">
              <img
                src={story.image}
                alt={story.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
              <p className="text-xs mt-1 truncate">{story.name}</p>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div className="mt-4">
          {loading && (
            <p className="text-center py-4 text-gray-500">Loading posts...</p>
          )}
          {error && (
            <p className="text-center py-4 text-red-500">{error}</p>
          )}
          {!loading && posts.length === 0 && (
            <p className="text-center py-4 text-gray-600">No posts yet.</p>
          )}

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id || post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
