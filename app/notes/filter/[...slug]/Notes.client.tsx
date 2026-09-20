'use client';

import { useState } from 'react';
import css from './NotesPage.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Link from 'next/link';

interface NotesClientProps {
  tag?: string;
}

function App({ tag }: NotesClientProps) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', query, currentPage, tag],
    queryFn: () => fetchNotes(currentPage, perPage, query, tag === 'all' ? undefined : tag),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const debouncedOnSearch = useDebouncedCallback(handleSearch, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchValue={query} onSearch={debouncedOnSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {data && data.notes.length === 0 && (
        <p className={css.text}>No notes found for your search.</p>
      )}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

export default App;
