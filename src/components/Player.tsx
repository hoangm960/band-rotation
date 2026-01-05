import { useEffect, useRef } from "react";

interface PlayerProps {
    url: string;
    onEnd?: () => void;
}

const Player = ({ url, onEnd }: PlayerProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            if ((window as any).YT) {
                initializePlayer();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.onload = () => {
                (window as any).YT.ready(() => {
                    initializePlayer();
                });
            };
            document.head.appendChild(script);
        };

        const initializePlayer = () => {
            if (
                iframeRef.current &&
                (url.includes("youtube.com") || url.includes("youtu.be"))
            ) {
                playerRef.current = new (window as any).YT.Player(
                    iframeRef.current,
                    {
                        events: {
                            onStateChange: (event: any) => {
                                if (
                                    event.data ===
                                    (window as any).YT.PlayerState.ENDED
                                ) {
                                    onEnd?.();
                                }
                            },
                        },
                    },
                );
            }
        };

        loadYouTubeAPI();
    }, [url, onEnd]);

    const getYouTubeId = (url: string) => {
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
        );
        return match ? match[1] : null;
    };

    const getSpotifyEmbed = (url: string) => {
        return url.replace("spotify.com", "open.spotify.com/embed");
    };

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = getYouTubeId(url);
        if (!videoId) return <div>Invalid YouTube URL</div>;
        return (
            <div>
                <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    allow="autoplay"
                    width="200"
                    height="150"
                    frameBorder="0"
                    className="w-full max-w-xs sm:max-w-sm"
                ></iframe>
            </div>
        );
    } else if (url.includes("spotify.com")) {
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

