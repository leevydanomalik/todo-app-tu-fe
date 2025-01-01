import React, { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from 'hooks/auth/auth-store';

// Define the shape of the context
interface UserContextType {
  user: any; // Replace `any` with your user type if defined
  loading: boolean;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => void;
}

// Provide a default value for the context
const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  handleLogin: async () => {},
  handleLogout: () => {},
});

// UserProvider Component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Replace `any` with your user type
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {login} = useAuth();

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    console.log("username.ctx.0", password)
    try {

      console.log("username.ctx", password)
      const loggedInUser = await login(username, password); // Call login API
      
      toast.success('Login successful!');
      console.log("loggedInUser",loggedInUser)
      
      setUser(loggedInUser); // Set the user state

      // Redirect based on roles
      if (loggedInUser.roles.includes('ROLE_USER')) {
        router.push('/example/task');
      } else {
        router.push('/example'); // Example for other roles
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use UserContext
export const useUser = () => {
  return useContext(UserContext);
};
