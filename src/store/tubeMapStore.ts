import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TubeMapData, Journey, ViewState, FilterCriteria, SearchResult } from '../types';
import { mockTubeMapData } from '../data/mockData';

interface TubeMapState {
  // Data
  tubeMapData: TubeMapData;
  
  // View State
  viewState: ViewState;
  
  // Filters and Search
  filterCriteria: FilterCriteria;
  searchQuery: string;
  searchResults: SearchResult[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  sidebarVisible: boolean;
  
  // Actions
  setTubeMapData: (data: TubeMapData) => void;
  updateViewState: (updates: Partial<ViewState>) => void;
  setFilterCriteria: (criteria: FilterCriteria) => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  selectJourney: (journeyId: string) => void;
  selectSubJourney: (subJourneyId: string) => void;
  clearSelection: () => void;
  toggleTheme: () => void;
  toggleLayoutOrientation: () => void;
  toggleSidebar: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  panTo: (x: number, y: number) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed properties
  getFilteredJourneys: () => Journey[];
  getSelectedJourney: () => Journey | undefined;
  getJourneyById: (id: string) => Journey | undefined;
}

const initialViewState: ViewState = {
  zoomLevel: 1,
  centerPosition: { x: 0, y: 0 },
  selectedJourneyId: undefined,
  selectedSubJourneyId: undefined,
  showArchitecture: false,
  showPainPoints: false,
  showMetrics: true,
  layoutOrientation: 'horizontal',
  theme: 'light'
};

const initialFilterCriteria: FilterCriteria = {
  journeyName: undefined,
  epicStatus: undefined,
  domain: undefined,
  feature: undefined,
  minRagStatus: undefined
};

export const useTubeMapStore = create<TubeMapState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        tubeMapData: mockTubeMapData,
        viewState: initialViewState,
        filterCriteria: initialFilterCriteria,
        searchQuery: '',
        searchResults: [],
        isLoading: false,
        error: null,
        sidebarVisible: false,

        // Actions
        setTubeMapData: (data) => set({ tubeMapData: data }),

        updateViewState: (updates) => 
          set((state) => ({
            viewState: { ...state.viewState, ...updates }
          })),

        setFilterCriteria: (criteria) => set({ filterCriteria: criteria }),

        setSearchQuery: (query) => {
          set({ searchQuery: query });
          if (query.trim()) {
            get().performSearch(query);
          } else {
            get().clearSearch();
          }
        },

        performSearch: (query) => {
          const { tubeMapData } = get();
          const results: SearchResult[] = [];
          const searchTerm = query.toLowerCase();

          // Search journeys
          tubeMapData.journeys.forEach(journey => {
            if (journey.name.toLowerCase().includes(searchTerm) ||
                journey.description.toLowerCase().includes(searchTerm) ||
                journey.domain.toLowerCase().includes(searchTerm)) {
              results.push({
                type: 'journey',
                id: journey.id,
                title: journey.name,
                description: journey.description,
                relevanceScore: calculateRelevanceScore(journey.name, journey.description, searchTerm)
              });
            }

            // Search sub-journeys
            journey.subJourneys.forEach(subJourney => {
              if (subJourney.name.toLowerCase().includes(searchTerm) ||
                  subJourney.description.toLowerCase().includes(searchTerm)) {
                results.push({
                  type: 'subJourney',
                  id: subJourney.id,
                  title: subJourney.name,
                  description: subJourney.description,
                  parentId: journey.id,
                  relevanceScore: calculateRelevanceScore(subJourney.name, subJourney.description, searchTerm)
                });
              }
            });

            // Search epics
            journey.epics.forEach(epic => {
              if (epic.title.toLowerCase().includes(searchTerm) ||
                  epic.description.toLowerCase().includes(searchTerm)) {
                results.push({
                  type: 'epic',
                  id: epic.id,
                  title: epic.title,
                  description: epic.description,
                  parentId: journey.id,
                  relevanceScore: calculateRelevanceScore(epic.title, epic.description, searchTerm)
                });
              }

              // Search features
              epic.features.forEach(feature => {
                if (feature.title.toLowerCase().includes(searchTerm) ||
                    feature.description.toLowerCase().includes(searchTerm)) {
                  results.push({
                    type: 'feature',
                    id: feature.id,
                    title: feature.title,
                    description: feature.description,
                    parentId: journey.id,
                    relevanceScore: calculateRelevanceScore(feature.title, feature.description, searchTerm)
                  });
                }
              });
            });
          });

          // Sort by relevance score
          results.sort((a, b) => b.relevanceScore - a.relevanceScore);

          set({ searchResults: results });
        },

        clearSearch: () => set({ searchQuery: '', searchResults: [] }),

        selectJourney: (journeyId) => 
          set((state) => ({
            viewState: {
              ...state.viewState,
              selectedJourneyId: journeyId,
              selectedSubJourneyId: undefined
            }
          })),

        selectSubJourney: (subJourneyId) =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              selectedSubJourneyId: subJourneyId
            }
          })),

        clearSelection: () =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              selectedJourneyId: undefined,
              selectedSubJourneyId: undefined
            }
          })),

        toggleTheme: () =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              theme: state.viewState.theme === 'light' ? 'dark' : 'light'
            }
          })),

        toggleLayoutOrientation: () =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              layoutOrientation: state.viewState.layoutOrientation === 'horizontal' ? 'vertical' : 'horizontal'
            }
          })),

        toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

        zoomIn: () => 
          set((state) => ({
            viewState: {
              ...state.viewState,
              zoomLevel: Math.min(state.viewState.zoomLevel * 1.2, 3)
            }
          })),

        zoomOut: () =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              zoomLevel: Math.max(state.viewState.zoomLevel / 1.2, 0.1)
            }
          })),

        resetZoom: () =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              zoomLevel: 1,
              centerPosition: { x: 0, y: 0 }
            }
          })),

        panTo: (x, y) =>
          set((state) => ({
            viewState: {
              ...state.viewState,
              centerPosition: { x, y }
            }
          })),

        setError: (error) => set({ error }),

        setLoading: (loading) => set({ isLoading: loading }),

        // Computed properties
        getFilteredJourneys: () => {
          const { tubeMapData, filterCriteria } = get();
          let journeys = tubeMapData.journeys;

          if (filterCriteria.journeyName) {
            journeys = journeys.filter(journey =>
              journey.name.toLowerCase().includes(filterCriteria.journeyName!.toLowerCase())
            );
          }

          if (filterCriteria.domain && filterCriteria.domain.length > 0) {
            journeys = journeys.filter(journey =>
              filterCriteria.domain!.includes(journey.domain)
            );
          }

          if (filterCriteria.epicStatus && filterCriteria.epicStatus.length > 0) {
            journeys = journeys.filter(journey =>
              filterCriteria.epicStatus!.includes(journey.metrics.ragStatus)
            );
          }

          if (filterCriteria.minRagStatus) {
            const ragOrder = { 'Red': 0, 'Amber': 1, 'Green': 2 };
            const minOrder = ragOrder[filterCriteria.minRagStatus];
            journeys = journeys.filter(journey =>
              ragOrder[journey.metrics.ragStatus] >= minOrder
            );
          }

          return journeys;
        },

        getSelectedJourney: () => {
          const { tubeMapData, viewState } = get();
          if (!viewState.selectedJourneyId) return undefined;
          return tubeMapData.journeys.find(journey => journey.id === viewState.selectedJourneyId);
        },

        getJourneyById: (id) => {
          const { tubeMapData } = get();
          return tubeMapData.journeys.find(journey => journey.id === id);
        }
      }),
      {
        name: 'tube-map-storage',
        partialize: (state) => ({
          viewState: state.viewState,
          filterCriteria: state.filterCriteria
        })
      }
    ),
    {
      name: 'tube-map-store'
    }
  )
);

// Helper function to calculate relevance score
function calculateRelevanceScore(title: string, description: string, searchTerm: string): number {
  const titleLower = title.toLowerCase();
  const descriptionLower = description.toLowerCase();
  const searchLower = searchTerm.toLowerCase();

  let score = 0;

  // Exact match in title gets highest score
  if (titleLower === searchLower) score += 100;
  else if (titleLower.includes(searchLower)) score += 50;

  // Partial match in description
  if (descriptionLower.includes(searchLower)) score += 25;

  // Bonus for matches at the beginning of words
  const titleWords = titleLower.split(' ');
  const descriptionWords = descriptionLower.split(' ');
  
  titleWords.forEach(word => {
    if (word.startsWith(searchLower)) score += 10;
  });
  
  descriptionWords.forEach(word => {
    if (word.startsWith(searchLower)) score += 5;
  });

  return score;
}