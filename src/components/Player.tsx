import YouTube from 'react-youtube';

interface PlayerProps {
  url: string;
  onEnd?: () => void;
}

const Player = ({ url, onEnd }: PlayerProps) => {
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const getSpotifyEmbed = (url: string) => {
    // Basic Spotify embed
    return url.replace('spotify.com', 'open.spotify.com/embed');
  };

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = getYouTubeId(url);
    if (!videoId) return <div>Invalid YouTube URL</div>;
    return (
      <YouTube
        videoId={videoId}
        onEnd={onEnd}
        opts={{ height: '150', width: '200', playerVars: { autoplay: 1 } }}
        className="w-full max-w-xs sm:max-w-sm"
      />
    );
  } else if (url.includes('spotify.com')) {
    const embedUrl = getSpotifyEmbed(url);
    return (
      <iframe
        src={embedUrl}
        width="200"
        height="150"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full max-w-xs sm:max-w-sm"
      ></iframe>
    );
  }
  return <div>Unsupported platform</div>;
};

export default Player;