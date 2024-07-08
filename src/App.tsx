import { FC } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppContent from "./components/AppContent";
import { AuthProvider } from "./context/OAuthProvider";

const App: FC = () => (
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
