import { FC, ReactNode, createContext, useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.setItem("token", response.access_token);
      setAccessToken(response.access_token);
    },
    onError: () => console.log("Login Failed"),
    scope:
      "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube",
  });

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthContextType {
  accessToken: string | null;
  login: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
