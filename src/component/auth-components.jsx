import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyC2MZJVI-nkbNfEG-qLu7KOgT2c3pheE8A",
  authDomain: "arcane-aab7a.firebaseapp.com",
  projectId: "arcane-aab7a",
  storageBucket: "arcane-aab7a.firebasestorage.app",
  messagingSenderId: "362668665168",
  appId: "1:362668665168:web:73e0fcfe725358de3c6455",
  measurementId: "G-F3KE405BDF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Create Auth Context
const AuthContext = createContext({});
// Enhanced User Profile Management
const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
        status: "online",
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Messages Service
const MessageService = {
  // Private Message Methods
  sendPrivateMessage: async (senderId, receiverId, messageText) => {
    try {
      const messageRef = collection(db, "privateMessages");
      return await addDoc(messageRef, {
        senderId,
        receiverId,
        text: messageText,
        timestamp: serverTimestamp(),
        type: "private",
        read: false,
      });
    } catch (error) {
      console.error("Error sending private message:", error);
      throw error;
    }
  },

  // Room Message Methods
  sendRoomMessage: async (roomId, senderId, messageText) => {
    try {
      const messageRef = collection(db, "roomMessages");
      return await addDoc(messageRef, {
        roomId,
        senderId,
        text: messageText,
        timestamp: serverTimestamp(),
        type: "room",
      });
    } catch (error) {
      console.error("Error sending room message:", error);
      throw error;
    }
  },

  // Room Management Methods
  createRoom: async (roomName, creatorId) => {
    try {
      const roomRef = collection(db, "rooms");
      const newRoom = await addDoc(roomRef, {
        name: roomName,
        creatorId,
        createdAt: serverTimestamp(),
        members: [creatorId],
        isPrivate: false,
      });
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  joinRoom: async (roomId, userId) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(userId),
      });
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  },
};

// Custom Hook for Real-time Messages
const useMessages = (chatType, chatId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    let q;
    const messagesRef = collection(
      db,
      chatType === "private" ? "privateMessages" : "roomMessages"
    );

    if (chatType === "private") {
      q = query(
        messagesRef,
        where("type", "==", "private"),
        where("senderId", "in", [currentUserId, chatId]),
        where("receiverId", "in", [currentUserId, chatId]),
        orderBy("timestamp", "asc")
      );
    } else {
      q = query(
        messagesRef,
        where("roomId", "==", chatId),
        orderBy("timestamp", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatType, chatId, currentUserId]);

  return { messages, loading };
};

export { MessageService, useMessages, createUserProfile };
// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => {
  return useContext(AuthContext);
};

// Loading Component
export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
      <p className="mt-4 text-lg text-gray-400">
        Entering the mystical realm...
      </p>
    </div>
  </div>
);

// Login Component
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            {isLogin ? "Enter the Arcane Realm" : "Join the Arcane Circle"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? "Welcome back, mystic" : "Begin your mystical journey"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-800 placeholder-gray-500 text-white rounded-lg bg-black bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-800 placeholder-gray-500 text-white rounded-lg bg-black bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                "Enter"
              ) : (
                "Join"
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              {isLogin
                ? "Need to create an account?"
                : "Already have an account?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
};

export default {
  AuthProvider,
  useAuth,
  LoginPage,
  LoadingScreen,
  ProtectedRoute,
};
