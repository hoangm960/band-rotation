import { create } from 'zustand';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface Song {
  id: string;
  url: string;
  title: string;
  likes: number;
  dislikes: number;
  practiced: boolean;
  randomize: boolean;
  addedAt: Date;
}

interface PlaylistState {
  songs: Song[];
  loading: boolean;
  error: string | null;
  addSong: (url: string, title: string) => Promise<void>;
  updateSong: (id: string, updates: Partial<Song>) => Promise<void>;
  removeSong: (id: string) => Promise<void>;
  fetchSongs: () => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  songs: [],
  loading: true,
  error: null,

  fetchSongs: () => {
    const q = query(collection(db, 'songs'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt?.toDate() || new Date(),
      })) as Song[];
      set({ songs, loading: false });
    }, (error) => {
      set({ error: error.message, loading: false });
    });
    return unsubscribe; // Note: Not storing unsubscribe, but could if needed
  },

  addSong: async (url: string, title: string) => {
    try {
      await addDoc(collection(db, 'songs'), {
        url,
        title,
        likes: 0,
        dislikes: 0,
        practiced: false,
        randomize: false,
        addedAt: new Date(),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateSong: async (id: string, updates: Partial<Song>) => {
    try {
      await updateDoc(doc(db, 'songs', id), updates);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeSong: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'songs', id));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));