import { useEffect, useState } from 'react';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import SongItem from '../components/SongItem';

const Ranking = () => {
  const { songs, fetchSongs, loading, error } = usePlaylistStore();
  const [filterPracticed, setFilterPracticed] = useState(true);

  useEffect(() => {
    const unsubscribe = fetchSongs();
    return unsubscribe;
  }, [fetchSongs]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const rankedSongs = songs
    .filter(song => !filterPracticed || !song.practiced)
    .sort((a, b) => b.likes - a.likes);

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl mb-4">Ranking</h1>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={filterPracticed}
          onChange={(e) => setFilterPracticed(e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm sm:text-base">Hide Practiced Songs</span>
      </label>
      {rankedSongs.map(song => (
        <SongItem key={song.id} song={song} showRandomizeCheckbox />
      ))}
    </div>
  );
};

export default Ranking;