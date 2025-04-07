import { createContext, useContext, useState } from "react";

// Create Auth Context
const AuthContext = createContext(null);

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
