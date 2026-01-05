import { useState, useEffect } from 'react';
import { usePlaylistStore } from '../stores/usePlaylistStore';

const AddSongForm = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loadingTitle, setLoadingTitle] = useState(false);
  const { addSong } = usePlaylistStore();

  const isValidUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('spotify.com');
  };

   const extractTitle = async (url: string): Promise<string> => {
     try {
       let oembedUrl = '';
       if (url.includes('youtube.com') || url.includes('youtu.be')) {
         oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
       } else if (url.includes('spotify.com')) {
         oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
       }
       if (oembedUrl) {
         const response = await fetch(oembedUrl);
         const data = await response.json();
         return data.title || 'Unknown Title';
       }
     } catch (error) {
       console.error('Error fetching title:', error);
     }
     return 'Unknown Title';
   };

   useEffect(() => {
     if (isValidUrl(url)) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setLoadingTitle(true);
       extractTitle(url).then((fetchedTitle) => {
         setTitle(fetchedTitle);
         setLoadingTitle(false);
       });
     } else {
       setTitle('');
     }
   }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(url)) {
      alert('Invalid URL. Must be YouTube or Spotify.');
      return;
    }
    await addSong(url, title || 'Unknown Title');
    setUrl('');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Song URL (YouTube or Spotify)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Song Title (auto-filled)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loadingTitle}
        />
        {loadingTitle && <span className="text-xs text-gray-500 ml-2">Loading title...</span>}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto">Add Song</button>
    </form>
  );
};

export default AddSongForm;