// src/components/UsersList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function UsersList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        // Don't include current user in the list
        if (userData.uid !== currentUser.uid) {
          usersList.push({ id: doc.id, ...userData });
        }
      });
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="border-r border-gray-200 w-80 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">
                  {user.status || 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}