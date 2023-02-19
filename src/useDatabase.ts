import { Database } from 'firebase/database';
import { create } from 'zustand';

type databaseType = {
  db: Database | null;
  setDb: (db: Database) => void;
};

export const useDatabase = create<databaseType>((set) => ({
  db: null,
  setDb: (db: Database) => set({ db }),
}));
