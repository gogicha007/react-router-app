import type { Route } from './+types/home';
import SearchBar from '~/components/search-bar/SearchBar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Welcome to Miami!' },
  ];
}

export default function Home() {
  const handleSearch = () => {};
  return <SearchBar handleSearch={handleSearch}/>;
}
