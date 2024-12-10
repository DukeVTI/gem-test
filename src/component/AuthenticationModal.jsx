import React, { useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { Button, Input, Card, CardContent } from '@/components/ui/';

const AuthenticationModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const auth = getAuth();
  const firestore = getFirestore();

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let userCredential;
      if (isLogin) {
        // Login existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user profile in Firestore
        await setDoc(doc(firestore, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          username: username,
          createdAt: new Date()
        });
      }
    } catch (error) {
      setError(error.message);
      console.error('Authentication Error', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? 'Welcome Back' : 'Join Arcane'}
          </h2>

          <form onSubmit={handleAuthentication} className="space-y-4">
            <Input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />

            <Input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />

            {!isLogin && (
              <Input 
                type="text"
                placeholder="Choose a Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
              />
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button 
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? 'Need an account? Sign Up' 
                : 'Already have an account? Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationModal;