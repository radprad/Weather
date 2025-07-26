import { renderHook, act } from '@testing-library/react-native';
import { useTubeMapStore } from '../../src/store/tubeMapStore';

describe('TubeMapStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTubeMapStore.setState(useTubeMapStore.getInitialState());
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    expect(result.current.viewState.zoomLevel).toBe(1);
    expect(result.current.viewState.theme).toBe('light');
    expect(result.current.viewState.layoutOrientation).toBe('horizontal');
    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
  });

  test('should update view state correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    act(() => {
      result.current.updateViewState({ zoomLevel: 2, theme: 'dark' });
    });
    
    expect(result.current.viewState.zoomLevel).toBe(2);
    expect(result.current.viewState.theme).toBe('dark');
  });

  test('should toggle theme correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    expect(result.current.viewState.theme).toBe('light');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.viewState.theme).toBe('dark');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.viewState.theme).toBe('light');
  });

  test('should toggle layout orientation correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    expect(result.current.viewState.layoutOrientation).toBe('horizontal');
    
    act(() => {
      result.current.toggleLayoutOrientation();
    });
    
    expect(result.current.viewState.layoutOrientation).toBe('vertical');
  });

  test('should handle zoom operations correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    act(() => {
      result.current.zoomIn();
    });
    
    expect(result.current.viewState.zoomLevel).toBeCloseTo(1.2);
    
    act(() => {
      result.current.zoomOut();
    });
    
    expect(result.current.viewState.zoomLevel).toBe(1);
    
    act(() => {
      result.current.zoomIn();
      result.current.resetZoom();
    });
    
    expect(result.current.viewState.zoomLevel).toBe(1);
    expect(result.current.viewState.centerPosition.x).toBe(0);
    expect(result.current.viewState.centerPosition.y).toBe(0);
  });

  test('should handle search correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    act(() => {
      result.current.setSearchQuery('payment');
    });
    
    expect(result.current.searchQuery).toBe('payment');
    expect(result.current.searchResults.length).toBeGreaterThan(0);
    
    // Check if Make a Payment journey is in results
    const paymentResult = result.current.searchResults.find(
      result => result.title.toLowerCase().includes('payment')
    );
    expect(paymentResult).toBeDefined();
  });

  test('should filter journeys correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    act(() => {
      result.current.setFilterCriteria({
        domain: ['Payments'],
        epicStatus: ['Green']
      });
    });
    
    const filteredJourneys = result.current.getFilteredJourneys();
    expect(filteredJourneys.length).toBeGreaterThan(0);
    
    // All filtered journeys should match criteria
    filteredJourneys.forEach(journey => {
      expect(['Payments']).toContain(journey.domain);
    });
  });

  test('should select and clear journey correctly', () => {
    const { result } = renderHook(() => useTubeMapStore());
    
    const journeyId = result.current.tubeMapData.journeys[0].id;
    
    act(() => {
      result.current.selectJourney(journeyId);
    });
    
    expect(result.current.viewState.selectedJourneyId).toBe(journeyId);
    
    const selectedJourney = result.current.getSelectedJourney();
    expect(selectedJourney).toBeDefined();
    expect(selectedJourney?.id).toBe(journeyId);
    
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.viewState.selectedJourneyId).toBeUndefined();
  });
});