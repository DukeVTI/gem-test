import React from 'react';
import { Loader2 } from 'lucide-react';

// Global Loading Spinner
export const LoadingSpinner = ({ size = 40, className = '' }) => (
  <div className="flex justify-center items-center">
    <Loader2 
      className={`animate-spin text-blue-500 ${className}`} 
      size={size} 
    />
  </div>
);

// Full Page Loading State
export const FullPageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
    <div className="text-center">
      <LoadingSpinner size={60} />
      <p className="mt-4 text-gray-600">Loading Arcane...</p>
    </div>
  </div>
);

// Button with Loading State
export const LoadingButton = ({ 
  isLoading, 
  children, 
  onClick, 
  className = '', 
  ...props 
}) => (
  <button
    disabled={isLoading}
    onClick={onClick}
    className={`
      flex items-center justify-center 
      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}
    {...props}
  >
    {isLoading ? (
      <LoadingSpinner size={20} className="mr-2" />
    ) : null}
    {children}
  </button>
);

// Authentication Modal with Loading
const AuthenticationModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authentication logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleAuthentication}>
        {/* Other form elements */}
        <LoadingButton 
          type="submit" 
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </LoadingButton>
      </form>
    </div>
  );
};

// Firebase Initialization with Loading
export const FirebaseInitializer = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Firebase initialization logic
        await initializeApp(firebaseConfig);
        // Additional setup if needed
      } catch (error) {
        console.error('Firebase Initialization Error', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeFirebase();
  }, []);

  if (isInitializing) {
    return <FullPageLoader />;
  }

  return children;
};