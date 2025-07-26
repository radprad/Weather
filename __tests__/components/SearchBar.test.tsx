import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../../src/components/Search/SearchBar';

// Mock the store
jest.mock('../../src/store/tubeMapStore', () => ({
  useTubeMapStore: jest.fn(() => ({
    searchQuery: '',
    searchResults: [],
    setSearchQuery: jest.fn(),
    clearSearch: jest.fn(),
    selectJourney: jest.fn(),
    viewState: { theme: 'light' },
  })),
}));

describe('SearchBar', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText } = render(<SearchBar />);
    
    expect(getByPlaceholderText('Search journeys, epics, features...')).toBeTruthy();
  });

  test('handles text input correctly', () => {
    const mockSetSearchQuery = jest.fn();
    const { useTubeMapStore } = require('../../src/store/tubeMapStore');
    
    useTubeMapStore.mockReturnValue({
      searchQuery: '',
      searchResults: [],
      setSearchQuery: mockSetSearchQuery,
      clearSearch: jest.fn(),
      selectJourney: jest.fn(),
      viewState: { theme: 'light' },
    });

    const { getByPlaceholderText } = render(<SearchBar />);
    const searchInput = getByPlaceholderText('Search journeys, epics, features...');
    
    fireEvent.changeText(searchInput, 'payment');
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('payment');
  });

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom search placeholder';
    const { getByPlaceholderText } = render(
      <SearchBar placeholder={customPlaceholder} />
    );
    
    expect(getByPlaceholderText(customPlaceholder)).toBeTruthy();
  });

  test('shows clear button when search query exists', () => {
    const { useTubeMapStore } = require('../../src/store/tubeMapStore');
    
    useTubeMapStore.mockReturnValue({
      searchQuery: 'payment',
      searchResults: [],
      setSearchQuery: jest.fn(),
      clearSearch: jest.fn(),
      selectJourney: jest.fn(),
      viewState: { theme: 'light' },
    });

    const { getByText } = render(<SearchBar />);
    
    expect(getByText('✕')).toBeTruthy();
  });

  test('adapts to dark theme', () => {
    const { useTubeMapStore } = require('../../src/store/tubeMapStore');
    
    useTubeMapStore.mockReturnValue({
      searchQuery: '',
      searchResults: [],
      setSearchQuery: jest.fn(),
      clearSearch: jest.fn(),
      selectJourney: jest.fn(),
      viewState: { theme: 'dark' },
    });

    const { getByPlaceholderText } = render(<SearchBar />);
    const searchInput = getByPlaceholderText('Search journeys, epics, features...');
    
    expect(searchInput).toBeTruthy();
  });
});