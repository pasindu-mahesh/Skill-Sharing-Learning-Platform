import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import FlagIcon from "@mui/icons-material/Flag";

const items = [
  { icon: <HomeIcon />, label: "Feed" },
  { icon: <MessageIcon />, label: "Messages" },
  { icon: <LiveTvIcon />, label: "Watch" },
  { icon: <StorefrontIcon />, label: "Marketplace" },
  { icon: <BookmarkIcon />, label: "Saved" },
  { icon: <EventIcon />, label: "Events" },
  { icon: <FlagIcon />, label: "Pages" },
  { icon: <GroupIcon />, label: "Groups" },
];

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen p-4 bg-white shadow-md hidden md:block">
      <h2 className="text-lg font-semibold mb-6">Explore</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
          >
            <span className="text-blue-600">{item.icon}</span>
            <span className="text-gray-800 text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
