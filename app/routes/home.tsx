import './home.css';
// import type { Route } from './+types/home';
import SearchBar from '~/components/search-bar/SearchBar';
import ThemeControls from '~/components/theme-controls/ThemeControls';

export function meta() {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Welcome to Miami!' },
  ];
}

export default function Home() {
  const handleSearch = () => {
    console.log('handle search');
  };
  return (
    <div className="home">
      <div className="home__top">
        <SearchBar handleSearch={handleSearch} />
        <ThemeControls />
      </div>
    </div>
  );
}
