import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Assume we have the recipientId from the context or passed as a prop
  const recipientId = "recipientUserId"; 

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push(doc.data());
      });
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: auth.currentUser.uid,
        receiverId: recipientId,
        text: message,
        timestamp: new Date(),
      });
      setMessage(""); // Clear message input after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-center">Chat</h2>
      </div>

      <div className="h-72 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 mb-2 rounded-lg bg-gray-100">
            <p className="text-sm font-medium text-gray-700">{msg.senderId}</p>
            <p className="text-gray-900">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
