import { FC, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/OAuthProvider";
import { getYoutubeEmbedUrl, getYoutubeVideoId } from "../utils/helper";
import { handleCreatePlaylist } from "../utils/api";

const VideoList: FC = () => {
  const location = useLocation();

  type PlaylistCreationData = {
    resources: {
      link: string;
      resourceType: "link" | "video";
    }[];
    title: string;
    description: string;
  };

  const { resources, title, description } =
    location.state as unknown as PlaylistCreationData;

  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createPlaylist = async () => {
    await handleCreatePlaylist(
      title,
      description,
      accessToken,
      resources,
      setLoading,
      setSuccess
    );
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-[32px] text-center">
        YouTube Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {resources?.map((resource, index: number) => {
          if (
            resource.resourceType !== "video" ||
            !getYoutubeVideoId(resource.link)
          ) {
            return (
              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-[#1e1e1e] bg-[#292929] text-white flex justify-center items-center cursor-pointer transition duration-300 ease-in-out"
              >
                {resource.resourceType !== "video"
                  ? "Not a video"
                  : "Not a youtube video"}
              </a>
            );
          }

          return (
            <div key={index} className="">
              <iframe
                className="w-full aspect-video"
                src={getYoutubeEmbedUrl(resource.link)}
                title={`YouTube video player - ${index}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </div>
      <div className="text-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={createPlaylist}
          disabled={loading}
        >
          {loading ? "Creating Playlist..." : "Export as Playlist"}
        </button>
      </div>
      {success && (
        <div className="absolute text-green-500 mt-4">
          Playlist created successfully!
        </div>
      )}
    </div>
  );
};

export default VideoList;
