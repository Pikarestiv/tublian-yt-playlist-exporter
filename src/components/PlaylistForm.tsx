import { FC, FormEvent, useState } from "react";

const PlaylistForm: FC<PlaylistFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(title, description);
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create YouTube Playlist
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;

interface PlaylistFormProps {
  onSubmit: (title: string, description: string) => void;
}
