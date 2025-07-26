import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { useTubeMapStore } from '../../store/tubeMapStore';
import { SearchResult } from '../../types';

interface SearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search journeys, epics, features...",
  onResultSelect,
}) => {
  const {
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch,
    selectJourney,
    viewState,
  } = useTubeMapStore();

  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setIsResultsVisible(text.trim().length > 0);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'journey' || result.parentId) {
      selectJourney(result.parentId || result.id);
    }
    onResultSelect?.(result);
    setIsResultsVisible(false);
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsResultsVisible(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'journey':
        return '🗺️';
      case 'subJourney':
        return '📍';
      case 'epic':
        return '🏆';
      case 'feature':
        return '⚡';
      default:
        return '📋';
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'journey':
        return 'Journey';
      case 'subJourney':
        return 'Sub-Journey';
      case 'epic':
        return 'Epic';
      case 'feature':
        return 'Feature';
      default:
        return 'Item';
    }
  };

  const isDarkTheme = viewState.theme === 'dark';

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        {
          backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
          borderBottomColor: isDarkTheme ? '#555555' : '#EEEEEE',
        },
      ]}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>{getResultIcon(item.type)}</Text>
          <Text
            style={[
              styles.resultTitle,
              { color: isDarkTheme ? '#FFFFFF' : '#000000' },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.resultType,
              { color: isDarkTheme ? '#BBBBBB' : '#666666' },
            ]}
          >
            {getResultTypeLabel(item.type)}
          </Text>
        </View>
        <Text
          style={[
            styles.resultDescription,
            { color: isDarkTheme ? '#CCCCCC' : '#666666' },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <View style={styles.resultFooter}>
          <Text
            style={[
              styles.relevanceScore,
              { color: isDarkTheme ? '#888888' : '#999999' },
            ]}
          >
            Relevance: {item.relevanceScore}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
            borderColor: isDarkTheme ? '#555555' : '#DDDDDD',
          },
        ]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[
            styles.searchInput,
            { color: isDarkTheme ? '#FFFFFF' : '#000000' },
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDarkTheme ? '#BBBBBB' : '#666666'}
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsResultsVisible(searchQuery.trim().length > 0)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Modal */}
      <Modal
        visible={isResultsVisible && searchResults.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setIsResultsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsResultsVisible(false)}
        >
          <View
            style={[
              styles.resultsContainer,
              {
                backgroundColor: isDarkTheme ? '#2A2A2A' : '#FFFFFF',
                borderColor: isDarkTheme ? '#555555' : '#DDDDDD',
              },
            ]}
          >
            <View style={styles.resultsHeader}>
              <Text
                style={[
                  styles.resultsTitle,
                  { color: isDarkTheme ? '#FFFFFF' : '#000000' },
                ]}
              >
                Search Results ({searchResults.length})
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsResultsVisible(false)}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchResults.slice(0, 10)} // Limit to top 10 results
              keyExtractor={(item) => item.id}
              renderItem={renderSearchResult}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* No Results Message */}
      {isResultsVisible && searchResults.length === 0 && searchQuery.trim().length > 0 && (
        <View
          style={[
            styles.noResultsContainer,
            {
              backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
              borderColor: isDarkTheme ? '#555555' : '#DDDDDD',
            },
          ]}
        >
          <Text
            style={[
              styles.noResultsText,
              { color: isDarkTheme ? '#BBBBBB' : '#666666' },
            ]}
          >
            No results found for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: '#999999',
  },
  resultsList: {
    maxHeight: 400,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resultTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  resultType: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  relevanceScore: {
    fontSize: 12,
  },
  noResultsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default SearchBar;