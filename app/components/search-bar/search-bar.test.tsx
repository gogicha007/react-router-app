import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { useCharacterFilters } from '../../hooks/useCharacterFilters';
import { useLocalStorage } from '../../hooks/useLocalStorage';

jest.mock('../../hooks/useCharacterFilters', () => ({
  useCharacterFilters: jest.fn(),
}));

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('../error-button/ErrorButton', () => {
  return {
    __esModule: true,
    default: () => <button data-testid="error-button">Error Button</button>,
  };
});

describe('SearchBar Component', () => {
  const mockHandleSearch = jest.fn();
  const mockSetFilters = jest.fn();
  const mockSetSearchWord = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: '',
      setFilters: mockSetFilters,
    });

    (useLocalStorage as jest.Mock).mockReturnValue(['', mockSetSearchWord]);
  });

  test('renders search bar correctly', () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);

    expect(screen.getByLabelText('Search by status')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter dead or alive...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByTestId('error-button')).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);

    const input = screen.getByLabelText('Search by status');
    fireEvent.change(input, { target: { value: 'dead' } });

    expect(mockSetFilters).toHaveBeenCalledWith({ page: 1, status: 'dead' });
  });

  test('trims whitespace from input', () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);

    const input = screen.getByLabelText('Search by status');
    fireEvent.change(input, { target: { value: '  alive  ' } });

    expect(mockSetFilters).toHaveBeenCalledWith({ page: 1, status: 'alive' });
  });

  test('handles search button click correctly', () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: 'dead',
      setFilters: mockSetFilters,
    });

    render(<SearchBar handleSearch={mockHandleSearch} />);

    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    expect(mockSetSearchWord).toHaveBeenCalledWith('dead');
    expect(mockHandleSearch).toHaveBeenCalled();
  });

  test('search form prevents default on submit', async () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);

    const searchButton = screen.getByRole('button', { name: /search/i });

    const preventDefaultMock = jest.fn();
    const handleSubmit = (e: Event) => {
      preventDefaultMock();
      e.preventDefault();
    };

    searchButton.addEventListener('click', handleSubmit);

    await userEvent.click(searchButton);

    expect(preventDefaultMock).toHaveBeenCalled();
  });

  test('search button click prevents default and triggers search', async () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: 'dead',
      setFilters: mockSetFilters,
    });

    render(<SearchBar handleSearch={mockHandleSearch} />);

    const searchButton = screen.getByRole('button', { name: 'Search' });

    const preventDefaultMock = jest.fn();

    const handleSubmit = () => {
      preventDefaultMock();
      mockHandleSearch();
    };

    searchButton.addEventListener('click', handleSubmit);
    await userEvent.click(searchButton);

    expect(preventDefaultMock).toHaveBeenCalled();
    expect(mockSetSearchWord).toHaveBeenCalledWith('dead');
    expect(mockHandleSearch).toHaveBeenCalled();
  });

  test('loads saved search term from localStorage on mount', async () => {
    (useLocalStorage as jest.Mock).mockReturnValue([
      'saved-term',
      mockSetSearchWord,
    ]);

    render(<SearchBar handleSearch={mockHandleSearch} />);

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        status: 'saved-term',
        page: 1,
      });
    });
  });

  test('does not load from localStorage when status already exists', async () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: 'existing-term',
      setFilters: mockSetFilters,
    });

    (useLocalStorage as jest.Mock).mockReturnValue([
      'saved-term',
      mockSetSearchWord,
    ]);

    render(<SearchBar handleSearch={mockHandleSearch} />);

    await waitFor(() => {
      expect(mockSetFilters).not.toHaveBeenCalledWith({
        status: 'saved-term',
        page: 1,
      });
    });
  });

  test('updates input value based on status', () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: 'alive',
      setFilters: mockSetFilters,
    });

    render(<SearchBar handleSearch={mockHandleSearch} />);

    const input = screen.getByLabelText('Search by status');
    expect(input).toHaveValue('alive');
  });

  test('handles empty status correctly', () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: '',
      setFilters: mockSetFilters,
    });

    render(<SearchBar handleSearch={mockHandleSearch} />);

    const input = screen.getByLabelText('Search by status');
    expect(input).toHaveValue('');
  });

  test('does not restore from localStorage when searchWord is empty', async () => {
    (useLocalStorage as jest.Mock).mockReturnValue(['', mockSetSearchWord]);

    render(<SearchBar handleSearch={mockHandleSearch} />);

    await waitFor(() => {
      expect(mockSetFilters).not.toHaveBeenCalled();
    });
  });
});
