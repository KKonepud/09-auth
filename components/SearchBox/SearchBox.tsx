import css from './SearchBox.module.css';

interface SearchBoxProps {
  searchValue: string;
  onSearch: (query: string) => void;
}

export default function SearchBox({ searchValue, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <input
      onChange={handleChange}
      defaultValue={searchValue}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
