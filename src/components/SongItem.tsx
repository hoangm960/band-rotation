import { useState } from 'react';
import type { Song } from '../stores/usePlaylistStore';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import Player from './Player';

interface SongItemProps {
  song: Song;
  showRandomizeCheckbox?: boolean;
}

const SongItem = ({ song, showRandomizeCheckbox = true }: SongItemProps) => {
  const { updateSong, removeSong } = usePlaylistStore();
  const [playing, setPlaying] = useState(false);
  const [hasLiked, setHasLiked] = useState(() => localStorage.getItem(`liked-${song.id}`) === 'true');
  const [hasDisliked, setHasDisliked] = useState(() => localStorage.getItem(`disliked-${song.id}`) === 'true');

  const handleLike = () => {
    if (hasLiked) {
      // Undo like
      updateSong(song.id, { likes: song.likes - 1 });
      setHasLiked(false);
      localStorage.removeItem(`liked-${song.id}`);
    } else {
      // Add like, remove dislike if present
      const updates: Partial<Song> = { likes: song.likes + 1 };
      if (hasDisliked) {
        updates.dislikes = song.dislikes - 1;
        setHasDisliked(false);
        localStorage.removeItem(`disliked-${song.id}`);
      }
      updateSong(song.id, updates);
      setHasLiked(true);
      localStorage.setItem(`liked-${song.id}`, 'true');
    }
  };
  const handleDislike = () => {
    if (hasDisliked) {
      // Undo dislike
      updateSong(song.id, { dislikes: song.dislikes - 1 });
      setHasDisliked(false);
      localStorage.removeItem(`disliked-${song.id}`);
    } else {
      // Add dislike, remove like if present
      const updates: Partial<Song> = { dislikes: song.dislikes + 1 };
      if (hasLiked) {
        updates.likes = song.likes - 1;
        setHasLiked(false);
        localStorage.removeItem(`liked-${song.id}`);
      }
      updateSong(song.id, updates);
      setHasDisliked(true);
      localStorage.setItem(`disliked-${song.id}`, 'true');
    }
  };
  const handlePlay = () => {
    setPlaying(true);
    localStorage.setItem(`listened-${song.id}`, 'true');
  };
  const handlePracticedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSong(song.id, { practiced: e.target.checked });
  };
  const handleRandomizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSong(song.id, { randomize: e.target.checked });
  };
  const handleRemove = () => removeSong(song.id);

  const isListened = !!localStorage.getItem(`listened-${song.id}`);

  return (
    <div className={`border p-2 sm:p-4 mb-2 ${isListened ? 'bg-gray-100 opacity-60' : ''} flex flex-col sm:flex-row sm:items-center`}>
      <div className="flex-1">
        <h3 className="text-sm sm:text-base">{song.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{song.url}</p>
        <p className="text-xs sm:text-sm">Likes: {song.likes} | Dislikes: {song.dislikes}</p>
      </div>
      <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 mt-2 sm:mt-0">
        <button onClick={handleLike} disabled={hasLiked} className={`p-1 text-xs sm:text-sm rounded ${hasLiked ? 'bg-gray-500' : 'bg-green-500'} text-white`}>Like</button>
        <button onClick={handleDislike} disabled={hasDisliked} className={`p-1 text-xs sm:text-sm rounded ${hasDisliked ? 'bg-gray-500' : 'bg-red-500'} text-white`}>Dislike</button>
        <button onClick={handlePlay} className="bg-blue-500 text-white p-1 text-xs sm:text-sm rounded">
          {isListened ? 'Replay' : 'Play'}
        </button>
        <button onClick={handleRemove} className="bg-red-600 text-white p-1 text-xs sm:text-sm rounded">Remove</button>
        <label className="flex items-center text-xs sm:text-sm">
          <input type="checkbox" checked={song.practiced} onChange={handlePracticedChange} className="mr-1" />
          Practiced
        </label>
        {showRandomizeCheckbox && (
          <label className="flex items-center text-xs sm:text-sm">
            <input type="checkbox" checked={song.randomize} onChange={handleRandomizeChange} className="mr-1" />
            Randomize
          </label>
        )}
      </div>
      {playing && <Player url={song.url} onEnd={() => setPlaying(false)} />}
    </div>
  );
};

export default SongItem;