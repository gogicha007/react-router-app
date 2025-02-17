import Results from '~/components/card-list/CardList';
import './home.css';
// import type { Route } from './+types/home';
import SearchBar from '~/components/search-bar/SearchBar';
import ThemeControls from '~/components/theme-controls/ThemeControls';
import { useState } from 'react';
import { useCharacterFilters } from '~/hooks/useCharacterFilters';
import { useGetListQuery } from '~/state/features/characters/charactersApiSlice';
import Loader from '~/components/loader/Loader';
import { Pagination } from '~/components/pagination/Pagination';
import { Outlet } from 'react-router';

type IQueryError = {
  status: number;
  data: {
    error: string;
  };
};

export function meta() {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Welcome to Miami!' },
  ];
}

export default function Home() {
  const { page, status } = useCharacterFilters();
  const [params, setParams] = useState({ page: 1, status: '' });
  const { data, isFetching, error } = useGetListQuery({
    page: +params.page,
    status: params.status,
  });

  const handleSearch = () => {
    setParams({ page: +page, status: status });
  };

  return (
    <div className="home">
      <header className="home__top">
        <SearchBar handleSearch={handleSearch} />
        <ThemeControls />
      </header>
      <main>
        {error && <h1>{(error as IQueryError).status}</h1>}
        {!error && data && (
          <div className="home__main">
            <div className="home__cardlist">
              <Results {...data} />
              <div className="home__devider"></div>
              <Pagination resInfo={data.info} handleSearch={handleSearch} />
            </div>
            <Outlet />
          </div>
        )}
      </main>
      {isFetching && <Loader />}
    </div>
  );
}
