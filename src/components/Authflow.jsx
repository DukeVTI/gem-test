import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { Shield, User, Wallet, ChevronRight, Sparkles } from 'lucide-react';

const AuthFlow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('welcome');
  const [formData, setFormData] = useState({
    username: '',
    wallet: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initAuth = async () => {
      try {
        WebApp.ready();
        const userData = WebApp.initDataUnsafe?.user;
        if (!userData) {
          throw new Error('Failed to get user data');
        }
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 10000));
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores allowed';
    return '';
  };

  const validateWallet = (wallet) => {
    if (!wallet) return 'Wallet address is required';
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return 'Invalid wallet address';
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (nextStep) => {
    if (step === 'username') {
      const error = validateUsername(formData.username);
      if (error) {
        setErrors(prev => ({ ...prev, username: error }));
        return;
      }
    }
    
    if (step === 'wallet') {
      const error = validateWallet(formData.wallet);
      if (error) {
        setErrors(prev => ({ ...prev, wallet: error }));
        return;
      }
    }
    
    setStep(nextStep);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-black/40 rounded-xl border border-red-500/30 p-6 text-center max-w-sm w-full">
          <div className="text-red-400 mb-2">⚠️</div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Welcome to GemQuest
              </h1>
              <p className="text-purple-200">
                Start your journey into the world of crypto gaming and rewards
              </p>
            </div>
            <button
              onClick={() => setStep('username')}
              className="w-full bg-gradient-to-br from-purple-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-blue-700 transition-all"
            >
              Begin Adventure
            </button>
          </div>
        );

      case 'username':
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-purple-200">Choose Your Username</h2>
              </div>
              <p className="text-purple-300 text-sm">This will be your identity in GemQuest</p>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
                className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-xl text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
              />
              {errors.username && (
                <p className="text-red-400 text-sm">{errors.username}</p>
              )}
            </div>
            <button
              onClick={() => handleSubmit('wallet')}
              className="w-full bg-gradient-to-br from-purple-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Wallet className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-purple-200">Connect Your Wallet</h2>
              </div>
              <p className="text-purple-300 text-sm">Enter your ETH wallet address to receive rewards</p>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.wallet}
                onChange={(e) => handleInputChange('wallet', e.target.value)}
                placeholder="0x..."
                className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-xl text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
              />
              {errors.wallet && (
                <p className="text-red-400 text-sm">{errors.wallet}</p>
              )}
            </div>
            <button
              onClick={() => handleSubmit('dashboard')}
              className="w-full bg-gradient-to-br from-purple-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Your Journey</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <div className="max-w-md mx-auto bg-black/40 rounded-xl border border-purple-500/30 overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
};

export default AuthFlow;