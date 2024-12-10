import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

// Import components
import AuthenticationModal from './components/AuthenticationModal';
import ChatWindow from './components/ChatWindow';
import UserProfileSetup from './components/UserProfileSetup';
import { LoadingSpinner, FullPageLoader } from './components/LoadingComponents';

// Firebase configuration
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './lib/firebaseConfig';

const ArcaneApp = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user profile
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile', error);
        }
        
        // Fetch all users
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, orderBy('username'));
        
        const unsubscribeUsers = onSnapshot(q, (snapshot) => {
          const userList = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(u => u.id !== currentUser.uid); // Exclude current user
          setUsers(userList);
        });

        setLoading(false);
        return () => unsubscribeUsers();
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-64 bg-gray-100 h-full p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Arcane</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Users</h3>
        {users.map(u => (
          <div 
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className="p-2 hover:bg-gray-200 cursor-pointer rounded"
          >
            {u.username}
          </div>
        ))}
      </div>

      <button 
        className="w-full bg-gray-200 p-2 rounded mb-2"
        disabled
      >
        Rooms (Coming Soon)
      </button>

      <button 
        onClick={() => auth.signOut()}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );

  // Render Logic
  if (loading) {
    return <FullPageLoader />;
  }

  // Not authenticated
  if (!user) {
    return <AuthenticationModal />;
  }

  // User needs to complete profile
  if (user && (!userProfile || !userProfile.username)) {
    return <UserProfileSetup user={user} />;
  }

  // Fully authenticated and profile complete
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow 
            currentUser={user}
            selectedUser={selectedUser}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ArcaneApp;