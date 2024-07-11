import { ILearningProgress, Phase, RoadmapWrap, Roadmaps } from "../types";
import { getYoutubeVideoId } from "./helper";

export const ft_lambda_url = process.env.REACT_APP_PROFILE_BACKEND_API_BASE;
// const ft_copilot_url = process.env.REACT_APP_COPILOT_API_BASE;
// console.log("FT lambda url ", ft_lambda_url);

export const lambda_headers: {
  "x-api-key": string;
  Accept: string;
  "Content-Type": string;
  Authorization?: string;
} = {
  "x-api-key": process.env.REACT_APP_PROFILE_BACKEND_API_KEY || "",
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const getHeaders = () => {
  const headers = { ...lambda_headers };
  return headers;
};

export const getTokenizedHeaders = () => {
  const headers = { ...lambda_headers };

  // const jwt = userProfile(localStorage).token();

  // const jwt = localStorage.getItem("token");
  const jwt = process.env.REACT_APP_USER_DEFAULT_JWT || "";
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  return headers;
};

export const getLambdaUrl = (path: string) => {
  return `${ft_lambda_url}${path}`;
};

export const generatePlaylistVideos = async (
  roadmapId: string,
  username: string,
  loader: any
) => {
  const url = getLambdaUrl(`/ft/learning/roadmap/get/${username}/${roadmapId}`);

  loader(true);

  var response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const roadmapWrap: RoadmapWrap = await response.json();

  const videos = await getAllVideosFromRoadmap(roadmapWrap.roadmap);
  loader(false);
  return videos;
  // console.log("🚀 ~ fetchResources ~ videos:", videos);
};

const getAllVideosFromRoadmap = async (roadmap: Roadmaps) => {
  let resources: { link: string; resourceType: "link" | "video" }[] = [];

  const phases = roadmap.phases;

  for (let phaseNo = 0; phaseNo <= phases.length; phaseNo++) {
    const { phaseData } = await getVideosFromPhase(roadmap.id, phases[phaseNo]);
    console.log("🚀 ~ getAllVideosFromRoadmap ~ resources:", resources);

    if (phaseData) {
      resources = [...resources, ...phaseData];
    }
  }

  // console.log("🚀 ~ fetchResources ~ resources:", resources);

  return resources;
};

const getVideosFromPhase = async (roadmapId: string, phase: Phase) => {
  let resources: { link: string; resourceType: "link" | "video" }[] = [];

  if (!phase || !phase.sections || phase.sections.length === 0)
    return { phaseData: resources };

  for (
    let sectionNumber = 0;
    sectionNumber <= phase.sections.length;
    sectionNumber++
  ) {
    // await getPhaseData(roadmapId, phaseId, sectionNumber);

    const { sectionResources } = await getPhaseData(
      roadmapId,
      phase.id,
      sectionNumber
    );

    if (sectionResources) {
      resources = [...resources, ...sectionResources];
    }
  }

  return { phaseData: resources };
};

const getPhaseData = async (
  roadmapId: string,
  phaseId: string,
  sectionNumber: number
) => {
  const url = getLambdaUrl(`/ft/pathway/progress/${phaseId}`);

  const response = await fetch(url, {
    method: "POST",
    headers: getTokenizedHeaders(),
    body: JSON.stringify({
      pathwayType: "course",
      // phaseContentFilters: {
      //   contentType: "video",
      //   timeFrame: 15,
      // },
      roadmapId,
      sectionDetails: {
        sectionNumber,
        learningObjectives: undefined,
      },
    }),
  });

  const data: { result: ILearningProgress } = await response.json();
  console.log("🚀 ~ data:", data.result);

  if (
    !data.result ||
    !data.result.progress ||
    !data.result.progress[sectionNumber] ||
    !data.result.progress[sectionNumber].content
  )
    return { sectionResources: undefined };

  const sectionResources = data.result.progress[sectionNumber].content

    .filter((contentItem) => contentItem.resourceType === "video")

    .map((contentItem) => ({
      link: contentItem.link,
      resourceType: contentItem.resourceType as "link" | "video",
    }));

  return { sectionResources };
};

export const handleCreatePlaylist = async (
  playlistTitle: string,
  playlistDesc: string,
  accessToken: string | null,
  resources: {
    link: string;
    resourceType: "link" | "video";
  }[],
  loader: any,
  setSuccess: any
) => {
  loader(true);
  setSuccess(false);

  const createPlaylistUrl =
    "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status";

  try {
    const playlistResponse = await fetch(createPlaylistUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          title: playlistTitle,
          description: playlistDesc,
          tags: ["learning", "playlist"],
          defaultLanguage: "en",
        },
        status: {
          privacyStatus: "public",
        },
      }),
    });

    if (!playlistResponse.ok) {
      throw new Error("Failed to create playlist");
    }

    const playlistData = await playlistResponse.json();

    // Add videos to the playlist
    for (const resource of resources) {
      const videoId = getYoutubeVideoId(resource.link);

      if (resource.resourceType === "video" && videoId) {
        try {
          const addVideosUrl =
            "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet";

          const addVideoResponse = await fetch(addVideosUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              snippet: {
                playlistId: playlistData.id,
                resourceId: {
                  kind: "youtube#video",
                  // videoId: new URL(resource.link).searchParams.get("v"),
                  videoId,
                },
              },
            }),
          });

          console.log("id", videoId);

          if (!addVideoResponse.ok) {
            throw new Error("Failed to add video to playlist");
          }
        } catch (error) {
          console.error("Error encountered:", error, videoId);
        }
      }
    }

    setSuccess(true);
  } catch (error) {
    console.error("Error creating playlist", error);
  } finally {
    loader(false);
  }
};
