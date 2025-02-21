import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
// import configureStore from 'redux-mock-store';
import PickCards from './PickCards';
import { clearSelection } from './selectedCardsSlice';
import Papa from 'papaparse';
import { mockData } from '../../../test_utils/mocks/mock-data';
import { setupStore } from '../../store';
import { renderWithProviders } from '../../../test_utils/test_utils';

jest.mock('papaparse', () => ({
  unparse: jest.fn(() => 'mocked-csv-data'),
}));

describe('PickCards Component', () => {
  let store: any;

  beforeEach(() => {
    store = setupStore({
      selectedCards: { selectedCards: [1] },
    });
    store.dispatch = jest.fn();
  });

  test('renders selected items count', () => {
    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>,
      { store: setupStore() }
    );

    expect(screen.getByText(/Items selected: 1/i)).toBeInTheDocument();
  });

  test('dispatches clearSelection on button click', () => {
    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>
    );

    const button = screen.getByText(/Deselect all/i);
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledWith(clearSelection());
  });

  test('downloads CSV when clicking Download CSV button', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    const mockClick = jest.fn();

    createElementSpy.mockReturnValue({
      setAttribute: jest.fn(),
      click: mockClick,
    } as unknown as HTMLElement);

    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Download CSV/i));

    expect(Papa.unparse).toHaveBeenCalledWith(
      [
        {
          ID: '1',
          Name: 'Card 1',
          Image: 'img1',
          Species: 'Species 1',
          Status: 'Alive',
        },
      ],
      { quotes: true, header: true }
    );
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  test('alerts when no cards are selected for CSV', () => {
    store = setupStore({ selectedCards: { selectedCards: [] } });
    window.alert = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <PickCards data={mockData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Download CSV/i));
    expect(window.alert).toHaveBeenCalledWith(
      'No cards selected for download!'
    );
  });
});
