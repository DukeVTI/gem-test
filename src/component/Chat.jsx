// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
  getDoc
} from 'firebase/firestore';
import { Send } from 'lucide-react';

const Chat = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRecipient = async () => {
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      if (chatDoc.exists()) {
        const recipientId = chatDoc.data().participants.find(
          id => id !== currentUser.uid
        );
        const recipientDoc = await getDoc(doc(db, 'users', recipientId));
        setRecipient(recipientDoc.data());
      }
    };

    fetchRecipient();

    const q = query(
      collection(db, `chats/${chatId}/messages`),
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
  }, [chatId, currentUser.uid]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-white shadow px-6 py-4">
        <div className="text-xl font-semibold text-gray-800">
          {recipient?.username || 'Loading...'}
        </div>
      </div>

      {/* Messages */}
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
  );
};

export default Chat;