// src/components/RoomChat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc
} from 'firebase/firestore';
import { Send, Users, Settings, X, UserPlus, LogOut, Trash2 } from 'lucide-react';

const RoomChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRoomAndMembers = async () => {
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        setRoom(roomData);
        setIsAdmin(roomData.createdBy === currentUser.uid);
        setInviteCode(roomData.code);
        
        // Fetch member details
        const memberPromises = roomData.members.map(memberId =>
          getDoc(doc(db, 'users', memberId))
        );
        const memberDocs = await Promise.all(memberPromises);
        const memberData = memberDocs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(memberData);
      } else {
        // Room doesn't exist, redirect to home
        navigate('/');
      }
    };

    fetchRoomAndMembers();

    const q = query(
      collection(db, `rooms/${roomId}/messages`),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = [];
      snapshot.forEach((doc) => {
        messageData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [roomId, currentUser.uid, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `rooms/${roomId}/messages`), {
        text: newMessage,
        senderId: currentUser.uid,
        senderUsername: currentUser.username,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      try {
        await updateDoc(doc(db, 'rooms', roomId), {
          members: arrayRemove(currentUser.uid)
        });
        navigate('/');
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        navigate('/');
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleInviteMember = async () => {
    const email = prompt('Enter the email of the user you want to invite:');
    if (email) {
      try {
        const usersQuery = query(collection(db, 'users'), where('email', '==', email));
        const snapshot = await getDocs(usersQuery);
        
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'rooms', roomId), {
            members: arrayUnion(userDoc.id)
          });
        } else {
          alert('User not found');
        }
      } catch (error) {
        console.error('Error inviting member:', error);
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await updateDoc(doc(db, 'rooms', roomId), {
          members: arrayRemove(memberId)
        });
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-800">
            {room?.name || 'Loading...'}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Users size={20} />
              <span>{members.length} members</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                      message.senderId === currentUser.uid
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.senderId !== currentUser.uid && (
                      <p className="text-xs font-medium mb-1">
                        {message.senderUsername}
                      </p>
                    )}
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.timestamp?.toDate().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Members Sidebar */}
          {showMembers && (
            <div className="w-64 bg-white border-l">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Members</h3>
                  <button
                    onClick={() => setShowMembers(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleInviteMember}
                    className="flex items-center space-x-2 w-full mb-4 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <UserPlus size={16} />
                    <span>Invite Member</span>
                  </button>
                )}
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-sm">{member.username}</span>
                      {isAdmin && member.id !== currentUser.uid && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Sidebar */}
          {showSettings && (
            <div className="w-64 bg-white border-l">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Room Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invite Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inviteCode}
                        readOnly
                        className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(inviteCode)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleLeaveRoom}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    <LogOut size={16} />
                    <span>Leave Room</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleDeleteRoom}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                      <span>Delete Room</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomChat;