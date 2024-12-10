// src/hooks/useStatus.js
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useStatus() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const userDoc = doc(db, 'users', currentUser.uid);

    // Set user as online
    setDoc(userDoc, {
      status: 'online',
      lastSeen: serverTimestamp()
    }, { merge: true });

    // Set user as offline when they leave
    return () => {
      setDoc(userDoc, {
        status: 'offline',
        lastSeen: serverTimestamp()
      }, { merge: true });
    };
  }, [currentUser]);
}