import { FC } from "react";

const VideoList: FC<VideoListProps> = ({ videos, onCreatePlaylist }) => {
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">YouTube Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {videos?.map((videoId, index) => (
          <div key={index} className="mb-4">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`YouTube video player - ${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onCreatePlaylist}
        >
          Create YouTube Playlist
        </button>
      </div>
    </div>
  );
};

export default VideoList;

interface VideoListProps {
  onCreatePlaylist: () => void;
  videos: string[];
}
