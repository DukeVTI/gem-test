// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import UsersList from './UsersList';
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
} from 'firebase/firestore';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!selectedUser) return;

    // Query messages between current user and selected user
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('createdAt'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        // Only include messages between the current user and selected user
        if (
          messageData.participants.includes(selectedUser.uid) &&
          messageData.participants.includes(currentUser.uid)
        ) {
          messages.push({ ...messageData, id: doc.id });
        }
      });
      setMessages(messages);
      scrollToBottom();
    });

    return unsubscribe;
  }, [selectedUser, currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === '' || !selectedUser) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderUid: currentUser.uid,
      senderEmail: currentUser.email,
      participants: [currentUser.uid, selectedUser.uid],
    });

    setNewMessage('');
  };

  return (
    <div className="flex h-screen">
      <UsersList onSelectUser={setSelectedUser} />
      
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                {selectedUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{selectedUser.email}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderUid === currentUser.uid
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderUid === currentUser.uid
                      ? 'bg-primary text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {message.senderEmail}
                  </div>
                  <div>{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a user to start messaging</p>
        </div>
      )}
    </div>
  );
}