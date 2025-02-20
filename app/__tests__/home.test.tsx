import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { renderWithProviders } from '../../app/test_utils/test_utils';
import { setupStore } from '../../app/state/store';
import Home from '../../app/routes/home';

// const mockStore = configureStore([]);

describe('Home Component', () => {
  //   let store: ReturnType<typeof setupStore>;

  //   beforeEach(() => {
  //     store = setupStore({
  //       // Mock any Redux state if needed
  //     });
  //   });

  test('renders Home component correctly', () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getAllByRole(`radio`).length).toBe(2);
  });

  test('displays Loader when fetching data', async () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('displays error message on API error', async () => {
    const mockError = { status: '404 Not Found' };

    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    // Simulating API error
    await waitFor(() => {
      expect(screen.getByText(mockError.status)).toBeInTheDocument();
    });
  });

  test('triggers search and updates params', async () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Check if state update logic was called
    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
    });
  });

  test('navigates back when clicking on the list', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useNavigate: () => mockNavigate,
    }));

    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    fireEvent.click(screen.getByTestId('home__cardlist'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
