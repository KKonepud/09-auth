import { create } from 'zustand';
import type { NoteFormValues } from '@/types/note';

interface NoteStore {
  draft: NoteFormValues;
  setDraft: (draft: Partial<NoteFormValues>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(set => ({
  draft: initialDraft,

  setDraft: draft =>
    set(state => ({
      draft: {
        ...state.draft,
        ...draft,
      },
    })),

  clearDraft: () => set({ draft: initialDraft }),
}));
