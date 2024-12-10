import React, { useState, useEffect, useRef } from 'react';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where
} from 'firebase/firestore';
import { Input, Button } from '@/components/ui/';

const ChatWindow = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const firestore = getFirestore();
  const messagesEndRef = useRef(null);

  // Create a unique chat room ID
  const getChatRoomId = (uid1, uid2) => {
    return uid1 > uid2 
      ? `${uid1}_${uid2}` 
      : `${uid2}_${uid1}`;
  };

  // Fetch Messages
  useEffect(() => {
    if (!selectedUser) return;

    const chatRoomId = getChatRoomId(currentUser.uid, selectedUser.uid);
    
    const messagesRef = collection(firestore, 'messages');
    const q = query(
      messagesRef, 
      where('chatRoomId', '==', chatRoomId),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedUser]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const chatRoomId = getChatRoomId(currentUser.uid, selectedUser.uid);

    await addDoc(collection(firestore, 'messages'), {
      text: newMessage,
      createdAt: new Date(),
      userId: currentUser.uid,
      username: currentUser.email.split('@')[0],
      chatRoomId: chatRoomId
    });

    setNewMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {selectedUser ? (
        <>
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">
              Chat with {selectedUser.username}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${
                  msg.userId === currentUser.uid 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div 
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.userId === currentUser.uid 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  <small className="text-xs opacity-70">
                    {msg.username}
                  </small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={sendMessage} 
            className="p-4 border-t flex items-center"
          >
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatWindow;