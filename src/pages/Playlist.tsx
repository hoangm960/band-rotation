import { useEffect, useState } from 'react';
import { Heart, ThumbsDown, SkipBack, SkipForward, X } from 'lucide-react';
import { updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import type { Song } from '../stores/usePlaylistStore';
import AddSongForm from '../components/AddSongForm';
import SongItem from '../components/SongItem';
import Player from '../components/Player';

const Playlist = () => {
  const { songs, fetchSongs, loading, error } = usePlaylistStore();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const unsubscribe = fetchSongs();
    return unsubscribe; // Cleanup on unmount
  }, [fetchSongs]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const unlistenedSongs = songs.filter(song => !localStorage.getItem(`listened-${song.id}`));

  const playPlaylist = () => {
    const currentUnlistened = songs.filter(song => !localStorage.getItem(`listened-${song.id}`));
    if (currentUnlistened.length > 0) {
      setPlaylistSongs(currentUnlistened);
      setPlayingIndex(0);
    }
  };

  const handlePlayerEnd = () => {
    // Mark current as listened
    localStorage.setItem(`listened-${playlistSongs[playingIndex!].id}`, 'true');
    if (playingIndex! < playlistSongs.length - 1) {
      const nextIndex = playingIndex! + 1;
      setPlayingIndex(nextIndex);
    } else {
      setPlayingIndex(null);
      setPlaylistSongs([]);
    }
  };

  const nextSong = () => {
    if (playingIndex !== null && playingIndex < playlistSongs.length - 1) {
      const nextIndex = playingIndex + 1;
      setPlayingIndex(nextIndex);
      localStorage.setItem(`listened-${playlistSongs[nextIndex].id}`, 'true');
    }
  };

  const prevSong = () => {
    if (playingIndex !== null && playingIndex > 0) {
      setPlayingIndex(playingIndex - 1);
    }
  };

  const stopPlaylist = () => {
    setPlayingIndex(null);
    setPlaylistSongs([]);
  };

  const handlePlayerLike = async () => {
    if (currentSong) {
      const likedKey = `liked-${currentSong.id}`;
      const dislikedKey = `disliked-${currentSong.id}`;
      const songRef = doc(db, 'songs', currentSong.id);
      if (localStorage.getItem(likedKey)) {
        // Undo like
        await updateDoc(songRef, { likes: increment(-1) });
        localStorage.removeItem(likedKey);
      } else {
        // Add like
        await updateDoc(songRef, { likes: increment(1) });
        localStorage.setItem(likedKey, 'true');
        // Remove dislike if present
        if (localStorage.getItem(dislikedKey)) {
          await updateDoc(songRef, { dislikes: increment(-1) });
          localStorage.removeItem(dislikedKey);
        }
      }
      setRefresh(refresh + 1);
    }
  };

  const handlePlayerDislike = async () => {
    if (currentSong) {
      const likedKey = `liked-${currentSong.id}`;
      const dislikedKey = `disliked-${currentSong.id}`;
      const songRef = doc(db, 'songs', currentSong.id);
      if (localStorage.getItem(dislikedKey)) {
        // Undo dislike
        await updateDoc(songRef, { dislikes: increment(-1) });
        localStorage.removeItem(dislikedKey);
      } else {
        // Add dislike
        await updateDoc(songRef, { dislikes: increment(1) });
        localStorage.setItem(dislikedKey, 'true');
        // Remove like if present
        if (localStorage.getItem(likedKey)) {
          await updateDoc(songRef, { likes: increment(-1) });
          localStorage.removeItem(likedKey);
        }
      }
      setRefresh(refresh + 1);
    }
  };

  const currentSong = playingIndex !== null ? playlistSongs[playingIndex] : null;

  return (
    <div className="p-2 sm:p-4 h-full flex flex-col">
      <div className="flex-1">
        <h1 className="text-2xl mb-4">Playlist</h1>
        <AddSongForm />
        {unlistenedSongs.length > 0 && !playingIndex && (
          <button onClick={playPlaylist} className="bg-blue-500 text-white p-2 mb-4">Play Playlist</button>
        )}
      <h2>All Songs</h2>
      {songs.map(song => (
        <SongItem key={song.id} song={song} />
      ))}
      </div>
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 sm:p-4 z-10 relative flex flex-col sm:flex-row sm:items-center">
          <button onClick={stopPlaylist} className="absolute top-1 left-1 sm:top-2 sm:left-2 p-1 rounded hover:scale-110 transition">
            <X size={16} className="sm:w-5 sm:h-5 text-gray-500" />
          </button>
          <div className="flex-1 pr-8 sm:pr-0">
            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 truncate">Now Playing: {currentSong.title}</h3>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={prevSong} className="p-1 sm:p-2 rounded hover:scale-110 transition">
                <SkipBack size={20} className="sm:w-6 sm:h-6 text-gray-500" />
              </button>
              <button onClick={nextSong} className="p-1 sm:p-2 rounded hover:scale-110 transition">
                <SkipForward size={20} className="sm:w-6 sm:h-6 text-gray-500" />
              </button>
              <button onClick={handlePlayerLike} className="p-1 sm:p-2 rounded hover:scale-110 transition">
                <Heart
                  size={20}
                  className={`sm:w-6 sm:h-6 ${localStorage.getItem(`liked-${currentSong.id}`) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                />
              </button>
              <button onClick={handlePlayerDislike} className="p-1 sm:p-2 rounded hover:scale-110 transition">
                <ThumbsDown
                  size={20}
                  className={`sm:w-6 sm:h-6 ${localStorage.getItem(`disliked-${currentSong.id}`) ? 'fill-gray-500 text-gray-500' : 'text-gray-500'}`}
                />
              </button>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-4 flex justify-center">
            <Player url={currentSong.url} onEnd={handlePlayerEnd} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;