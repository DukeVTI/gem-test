// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Users, MessageSquare, LogOut, Clock, Users as UsersIcon } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('recents');
  const [users, setUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, 'users'), orderBy('username'));
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUser.uid);
      setUsers(usersData);
    };

    const fetchRecentChats = async () => {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessageAt', 'desc')
      );
      const snapshot = await getDocs(chatsQuery);
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentChats(chatsData);
    };

    const fetchRooms = async () => {
      const roomsQuery = query(collection(db, 'rooms'));
      const snapshot = await getDocs(roomsQuery);
      const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    };

    fetchUsers();
    fetchRecentChats();
    fetchRooms();
  }, [currentUser.uid]);

  const handleCreateRoom = async () => {
    const roomName = prompt('Enter room name:');
    if (roomName) {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await addDoc(collection(db, 'rooms'), {
        name: roomName,
        code: roomCode,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        members: [currentUser.uid]
      });
    }
  };

  const handleJoinRoom = async () => {
    const roomCode = prompt('Enter room code:');
    if (roomCode) {
      const roomQuery = query(collection(db, 'rooms'), where('code', '==', roomCode));
      const snapshot = await getDocs(roomQuery);
      if (!snapshot.empty) {
        const roomDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'rooms', roomDoc.id), {
          members: arrayUnion(currentUser.uid)
        });
      } else {
        alert('Room not found');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="text-xl font-bold text-gray-800 mb-8">
            {currentUser.username}
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('recents')}
              className={`flex items-center space-x-2 w-full p-2 rounded ${
                activeTab === 'recents' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={20} />
              <span>Recents</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 w-full p-2 rounded ${
                activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoomDropdown(!showRoomDropdown)}
                className={`flex items-center space-x-2 w-full p-2 rounded ${
                  activeTab === 'rooms' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={20} />
                <span>Rooms</span>
              </button>
              
              {showRoomDropdown && (
                <div className="absolute left-0 w-full mt-2 bg-white border rounded shadow-lg">
                  <button
                    onClick={handleCreateRoom}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Create Room
                  </button>
                  <button
                    onClick={handleJoinRoom}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Join Room
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full p-2 rounded text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'recents' && 'Recent Chats'}
              {activeTab === 'users' && 'All Users'}
              {activeTab === 'rooms' && 'Chat Rooms'}
            </h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'recents' && (
            <div className="space-y-4">
              {recentChats.map(chat => (
                <div
                  key={chat.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-medium text-gray-900">
                        {chat.participants.find(id => id !== currentUser.uid)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(chat.lastMessageAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last active: {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-4">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-gray-900">
                        {room.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Room Code: {room.code}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {room.members.length} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;