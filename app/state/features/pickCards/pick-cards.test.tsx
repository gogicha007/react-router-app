import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PickCards from './PickCards';
import { clearSelection } from './selectedCardsSlice';
import Papa from 'papaparse';
import { mockData, mockReduxData } from '../../../test_utils/mocks/mock-data';
import { setupStore } from '../../store';
import { renderWithProviders } from '../../../test_utils/test_utils';

jest.mock('papaparse', () => ({
  unparse: jest.fn(() => 'mocked-csv-data'),
}));

describe('PickCards Component', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = setupStore({
      selectedCards: { selectedCards: [1] },
    });
    mockStore.dispatch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders selected items count', () => {
    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>,
      { store: mockStore }
    );

    expect(screen.getByText(/Items selected: 1/i)).toBeInTheDocument();
  });

  test('dispatches clearSelection on button click', () => {
    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>,
      { store: mockStore }
    );

    const button = screen.getByText(/Deselect all/i);
    fireEvent.click(button);
    expect(mockStore.dispatch).toHaveBeenCalledWith(clearSelection());
  });

  test('downloads CSV when clicking Download CSV button', () => {
    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockReduxData} />
      </MemoryRouter>,
      { store: mockStore }
    );

    const downloadButton = screen.getByText(/Download CSV/i);
    fireEvent.click(downloadButton);

    expect(Papa.unparse).toHaveBeenCalledWith(
      [
        {
          ID: 1,
          Name: 'Test Card',
          Image: 'test-image.jpg',
          Species: 'Test',
          Status: 'Alive',
        },
      ],
      { quotes: true, header: true }
    );
    const downloadLink = screen.getByTestId('csvDownloadLink');
    expect(downloadLink).toHaveAttribute('href');
    expect(downloadLink).toHaveAttribute('download', '1_characters.csv');

    fireEvent.click(downloadLink);
  });

  test('alerts when no cards are selected for CSV', () => {
    mockStore = setupStore({ selectedCards: { selectedCards: [] } });
    window.alert = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>,
      { store: mockStore }
    );

    fireEvent.click(screen.getByText(/Download CSV/i));
    expect(window.alert).toHaveBeenCalledWith(
      'No cards selected for download!'
    );
  });
});
