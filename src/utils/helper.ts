export const getYoutubeEmbedUrl = (url: string): string | undefined => {
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(urlPattern);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return undefined; // Return null if the URL does not match a YouTube video pattern
};

export const getYoutubeVideoId = (url: string): string | undefined => {
  // Define the regular expression pattern for YouTube URLs
  const urlPattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

  // Match the URL against the pattern
  const match = url.match(urlPattern);

  // If there's a match, return the video ID (captured group 1), otherwise return null
  return match ? match[1] : undefined;
};
