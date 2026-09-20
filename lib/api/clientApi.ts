import api from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string,
  tag?: string
): Promise<NotesResponse> {
  const response = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
}

export async function createNote(note: Pick<Note, 'title' | 'content' | 'tag'>): Promise<Note> {
  const response = await api.post<Note>('/notes', note);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>('/auth/register', credentials);

  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>('/auth/login', credentials);

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  try {
    const response = await api.get<{ success: boolean }>('/auth/session');
    return response.data.success;
  } catch {
    return false;
  }
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me');

  return response.data;
}

export async function updateMe(username: string): Promise<User> {
  const response = await api.patch<User>('/users/me', { username });
  return response.data;
}
