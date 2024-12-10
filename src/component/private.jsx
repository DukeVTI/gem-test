import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Layout,
  ChevronDown,
  Send,
  Plus,
  Hash,
  LogOut
} from "lucide-react";
import { useAuth } from "./auth-components";

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Dummy data - replace with Firebase data
  const recentChats = [
    {
      id: 1,
      name: "Duke001",
      lastMessage: "Hey Duke, we are ready to go live Sir",
    },
    { id: 2, name: "Ethan0Z", lastMessage: "Found a new spell pattern." },
  ];

  const allUsers = [
    { id: 1, name: "Duke001", status: "channeling" },
    { id: 2, name: "Ethan0Z", status: "offline" },
    { id: 3, name: "Sorcerer Carol", status: "channeling" },
  ];

  const rooms = [
    { id: "room1", name: "BotMasters Circle", code: "SC123" },
    { id: "room2", name: "Arcane Studies", code: "AS456" },
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Greetings, fellow mystic!",
      sender: "Duke001",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      text: "Hey Duke, we are ready to go live Sir",
      sender: "You",
      timestamp: "10:31 AM",
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          sender: "You",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleJoinRoom = () => {
    const roomExists = rooms.some((room) => room.code === roomCode);
    if (roomExists) {
      alert("Successfully joined the mystical chamber!");
      setIsJoinRoomOpen(false);
    } else {
      alert("Invalid arcane sigil. Please try again.");
    }
  };

  const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors ${
        isActive
          ? "bg-black bg-opacity-60 text-white shadow-lg"
          : "text-gray-400 hover:bg-black hover:bg-opacity-40"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const Modal = ({ isOpen, onClose, title, children }) =>
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-950 rounded-lg p-6 w-96 border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );

  const CreateRoomModal = () => (
    <Modal
      isOpen={isCreateRoomOpen}
      onClose={() => setIsCreateRoomOpen(false)}
      title="Create New Room"
    >
      <input
        type="text"
        placeholder="Room Name"
        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-white"
      />
      <button
        onClick={() => setIsCreateRoomOpen(false)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Room
      </button>
    </Modal>
  );

  const JoinRoomModal = () => (
    <Modal
      isOpen={isJoinRoomOpen}
      onClose={() => setIsJoinRoomOpen(false)}
      title="Join Room"
    >
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-white"
      />
      <button
        onClick={handleJoinRoom}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Join Room
      </button>
    </Modal>
  );

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-950 shadow-xl flex flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-black bg-opacity-40">
          <h1 className="text-2xl font-bold text-white">Arcane</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 space-y-2">
          <NavButton
            icon={MessageCircle}
            label="Recent Chats"
            isActive={activeTab === "recent"}
            onClick={() => setActiveTab("recent")}
          />
          <NavButton
            icon={Users}
            label="Users"
            isActive={activeTab === "frens"}
            onClick={() => setActiveTab("frens")}
          />
          <NavButton
            icon={Layout}
            label="Rooms"
            isActive={activeTab === "rooms"}
            onClick={() => setActiveTab("rooms")}
          />
          <NavButton
            icon={LogOut}
            label="Logout"
            onClick={() => handleLogout()}
          />
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {activeTab === "recent" && (
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 hover:bg-black hover:bg-opacity-40 rounded-lg cursor-pointer"
                >
                  <div className="font-medium text-gray-200">{chat.name}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "frens" && (
            <div className="space-y-2">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-black hover:bg-opacity-40 rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <div className="font-medium text-gray-200">{user.name}</div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.status === "channeling"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "rooms" && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setIsCreateRoomOpen(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Room
                </button>
                <button
                  onClick={() => setIsJoinRoomOpen(true)}
                  className="w-full bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition-colors flex items-center justify-center border border-gray-800"
                >
                  <Hash className="mr-2 h-4 w-4" />
                  Join Room
                </button>
              </div>

              <div className="space-y-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-3 hover:bg-black hover:bg-opacity-40 rounded-lg cursor-pointer"
                  >
                    <div className="font-medium text-gray-200">{room.name}</div>
                    <div className="text-sm text-gray-400">
                      Code: {room.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {/* Chat Header */}
        <div className="bg-black bg-opacity-40 p-4 shadow-lg border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Duke001</h2>
          <div className="text-sm text-gray-400">Online</div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  message.sender === "You"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className="text-xs mt-1 opacity-75">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-black bg-opacity-40 p-4 border-t border-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <CreateRoomModal />
      <JoinRoomModal />
    </div>
  );
};

export default ChatApp;
