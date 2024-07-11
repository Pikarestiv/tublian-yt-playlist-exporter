import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePlaylistVideos } from "../utils/api";

const FormPage: FC = () => {
  const [loading, setLoading] = useState(false);

  const [roadmapId, setRoadmapId] = useState(
    "roadmap-Pikarestiv-01fdb11045654f3b585e5b3b25787e80-f974b37f-c825-4cda-ab01-7f6be28caf20"
  );

  const [username, setUsername] = useState("Pikarestiv");
  const [title, setTitle] = useState("Test Playlist");
  const [description, setDescription] = useState("Test playlist details");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const resources = await generatePlaylistVideos(
      roadmapId,
      username,
      (state: boolean) => setLoading(state)
    );

    console.log("🚀 ~ handleSubmit ~ resources:", resources);

    navigate("/videos", { state: { resources, title, description } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="p-4 max-w-screen-md w-[90%] md:w-[50%] mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Enter Details</h2>

        <div className="mb-4">
          <label className="block mb-2">Roadmap ID</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={roadmapId}
            onChange={(e) => setRoadmapId(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Playlist Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Playlist Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Loading..." : "Fetch Resources"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
