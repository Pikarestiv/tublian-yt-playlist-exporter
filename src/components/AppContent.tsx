import React, { useState, useEffect } from "react";
import VideoList from "./VideoList";
import PlaylistForm from "./PlaylistForm";
import { useAuth } from "../context/OAuthProvider";

const AppContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [playlistDetails, setPlaylistDetails] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const { accessToken, login } = useAuth();

  const videos = [
    "gieEQFIfgYc",
    "30LWjhZzg50",
    "d56mG7DezGs",
    "JHEB7RhJG1Y",
    "5ChkQKUzDCs",
    "EcCTIExsqmI",
    "EzTxYQmU8OE",
    "vwSlYG7hFk0",
  ];

  const handleCreatePlaylist = () => {
    setShowForm(true);
    setSuccess(false);
  };

  const handleFormSubmit = (title: string, description: string) => {
    if (!accessToken) {
      setPlaylistDetails({ title, description });
      login();
    } else {
      createPlaylist(title, description);
    }
  };

  useEffect(() => {
    if (accessToken && playlistDetails) {
      createPlaylist(playlistDetails.title, playlistDetails.description);
    }
    
    //eslint-disable-next-line
  }, [accessToken, playlistDetails]);

  const createPlaylist = async (title: string, description: string) => {
    setLoading(true);
    setSuccess(false);

    try {
      const playlistResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            snippet: {
              title: title,
              description: description,
              tags: ["learning", "playlist"],
              defaultLanguage: "en",
            },
            status: {
              privacyStatus: "public",
            },
          }),
        }
      );

      if (!playlistResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      // Add videos to the playlist
      for (const videoId of videos) {
        const addVideoResponse = await fetch(
          "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              snippet: {
                playlistId: playlistId,
                resourceId: {
                  kind: "youtube#video",
                  videoId: videoId,
                },
              },
            }),
          }
        );

        if (!addVideoResponse.ok) {
          throw new Error("Failed to add video to playlist");
        }
      }

      setSuccess(true);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating playlist", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!loading && !success && (
        <>
          {showForm ? (
            <PlaylistForm onSubmit={handleFormSubmit} />
          ) : (
            <VideoList
              videos={videos}
              onCreatePlaylist={handleCreatePlaylist}
            />
          )}
        </>
      )}

      {loading && <div className="absolute">Loading...</div>}

      {success && (
        <div className="absolute text-green-500">
          Playlist created successfully!
        </div>
      )}
    </div>
  );
};

export default AppContent;
