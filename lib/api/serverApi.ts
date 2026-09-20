import { cookies } from 'next/headers';
import api from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string,
  tag?: string
): Promise<NotesResponse> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function checkSession(): Promise<boolean> {
  const cookieHeader = await getCookieHeader();

  try {
    const response = await api.get<{ success: boolean }>('/auth/session', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data.success;
  } catch {
    return false;
  }
}
