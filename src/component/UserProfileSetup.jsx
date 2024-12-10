import React, { useState } from 'react';
import { 
  getFirestore, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { Button, Input, Card, CardContent } from '@/components/ui/';

const UserProfileSetup = ({ user }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);

  const firestore = getFirestore();

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Update user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: username,
        bio: bio || '',
        profileSetupComplete: true
      });
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile Setup Error', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Complete Your Profile
          </h2>

          <form onSubmit={handleProfileSetup} className="space-y-4">
            <Input 
              type="text"
              placeholder="Choose a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
            />

            <Input 
              type="text"
              placeholder="Optional Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full"
            />

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSetup;