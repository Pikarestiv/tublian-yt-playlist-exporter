import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/OAuthProvider";

const Home: FC = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/form");
    }
  }, [navigate, accessToken]);

  const handleAuthenticate = async () => {
    await new Promise<void>(() => {
      login();
    });
    navigate("/form");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Tublian YT Playlist Exporter</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleAuthenticate}
      >
        Authenticate
      </button>
    </div>
  );
};

export default Home;
