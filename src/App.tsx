import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/OAuthProvider";
import HomePage from "./components/Home";
import FormPage from "./components/FormPage";
import VideoList from "./components/VideoList";

const App: FC = () => (
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/videos" element={<VideoList />} />
        </Routes>
      </Router>
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
