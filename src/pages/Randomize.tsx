import { useEffect, useState, useMemo } from 'react';
import { usePlaylistStore } from '../stores/usePlaylistStore';

const Randomize = () => {
  const { songs, fetchSongs, updateSong } = usePlaylistStore();
  const randomizeSongs = useMemo(() => songs.filter(song => song.randomize), [songs]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = fetchSongs();
    return unsubscribe;
  }, [fetchSongs]);

  const spin = () => {
    if (randomizeSongs.length === 0) return;
    setSpinning(true);
    setWinner(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * randomizeSongs.length);
      const selected = randomizeSongs[randomIndex];
      setWinner(selected.title);
      // Optionally remove from randomize after selection
      updateSong(selected.id, { randomize: false });
      setSpinning(false);
    }, 2000); // Simulate spin time
  };

  if (randomizeSongs.length === 0) return <div>No songs to randomize</div>;

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl mb-4">Randomize Practice</h1>
      <button
        onClick={spin}
        disabled={spinning}
        className="bg-blue-500 text-white p-2 mb-4 rounded"
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
      {spinning && <div className="text-sm">Spinning...</div>}
      {winner && <div className="text-sm font-semibold">Selected: {winner}</div>}
      <div className="border p-2 sm:p-4 text-xs sm:text-sm">
        <strong>Randomize Songs:</strong> {randomizeSongs.map(s => s.title).join(', ')}
      </div>
    </div>
  );
};

export default Randomize;