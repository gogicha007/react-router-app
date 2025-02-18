import './search-bar.css';
import { useEffect } from 'react';
import ErrorButton from '../error-button/ErrorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilters';
import { useLocalStorage } from '~/hooks/useLocalStorage';

const SearchBar = ({ handleSearch }: { handleSearch: () => void }) => {
  const [searchWord, setSearchWord] = useLocalStorage('Search-Word', '');
  const { status, setFilters } = useCharacterFilters();

  const clickSearch = async () => {
    setSearchWord(status);
    handleSearch();
  };

  const changeInput = (word: string) => setFilters({ page: 1, status: word });

  useEffect(() => {
    if (!status && searchWord) setFilters({ status: searchWord, page: 1 });
  }, [setFilters]);

  return (
    <div className="search__bar">
      <form className="search__form">
        <label htmlFor="search">Search by status</label>
        <input
          value={status}
          onChange={(e) => changeInput(e.target.value.trim())}
          type="search"
          id="search"
          name="status"
          placeholder="Enter dead or alive..."
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            clickSearch();
          }}
        >
          Search
        </button>
      </form>
      <ErrorButton />
    </div>
  );
};

export default SearchBar;
