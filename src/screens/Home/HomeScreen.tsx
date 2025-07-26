import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTubeMapStore } from '../../store/tubeMapStore';
import TubeMap from '../../components/TubeMap/TubeMap';
import SearchBar from '../../components/Search/SearchBar';
import FilterPanel from '../../components/Filter/FilterPanel';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import JourneyDetailModal from '../../components/Journey/JourneyDetailModal';

const HomeScreen: React.FC = () => {
  const {
    viewState,
    getSelectedJourney,
    toggleTheme,
    toggleLayoutOrientation,
    zoomIn,
    zoomOut,
    resetZoom,
    clearSelection,
  } = useTubeMapStore();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showJourneyDetail, setShowJourneyDetail] = useState(false);

  const selectedJourney = getSelectedJourney();
  const isDarkTheme = viewState.theme === 'dark';

  const handleJourneyPress = () => {
    if (selectedJourney) {
      setShowJourneyDetail(true);
    }
  };

  const handleCloseJourneyDetail = () => {
    setShowJourneyDetail(false);
    clearSelection();
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkTheme ? '#000000' : '#FFFFFF' }
    ]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#000000' : '#FFFFFF'}
      />

      {/* Header */}
      <View style={[
        styles.header,
        { 
          backgroundColor: isDarkTheme ? '#1A1A1A' : '#FFFFFF',
          borderBottomColor: isDarkTheme ? '#333333' : '#E0E0E0',
        }
      ]}>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDarkTheme ? '#FFFFFF' : '#000000' }
          ]}>
            Barclays Journey Map
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDarkTheme ? '#BBBBBB' : '#666666' }
          ]}>
            Customer Journey Visualization
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
            onPress={() => setShowFilterPanel(true)}
          >
            <Text style={styles.headerButtonIcon}>🔧</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
            onPress={toggleTheme}
          >
            <Text style={styles.headerButtonIcon}>
              {isDarkTheme ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar onResultSelect={handleJourneyPress} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Control Panel */}
        <ControlPanel 
          onLayoutToggle={toggleLayoutOrientation}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />

        {/* Tube Map */}
        <View style={styles.mapContainer}>
          <TubeMap onJourneyPress={handleJourneyPress} />
        </View>
      </View>

      {/* Selected Journey Info Bar */}
      {selectedJourney && (
        <View style={[
          styles.journeyInfoBar,
          { 
            backgroundColor: isDarkTheme ? '#2A2A2A' : '#F5F5F5',
            borderTopColor: isDarkTheme ? '#333333' : '#E0E0E0',
          }
        ]}>
          <View style={styles.journeyInfo}>
            <Text style={[
              styles.journeyName,
              { color: isDarkTheme ? '#FFFFFF' : '#000000' }
            ]}>
              {selectedJourney.name}
            </Text>
            <Text style={[
              styles.journeyDomain,
              { color: isDarkTheme ? '#BBBBBB' : '#666666' }
            ]}>
              {selectedJourney.domain} • {selectedJourney.metrics.portfolioEpicsCount} Epics • {selectedJourney.metrics.ragStatus}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={handleJourneyPress}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <FilterPanel 
        visible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />

      {selectedJourney && (
        <JourneyDetailModal
          visible={showJourneyDetail}
          journey={selectedJourney}
          onClose={handleCloseJourneyDetail}
        />
      )}

      {/* Zoom Level Indicator */}
      <View style={[
        styles.zoomIndicator,
        { backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.zoomText,
          { color: isDarkTheme ? '#FFFFFF' : '#000000' }
        ]}>
          {Math.round(viewState.zoomLevel * 100)}%
        </Text>
      </View>

      {/* Layout Orientation Indicator */}
      <View style={[
        styles.layoutIndicator,
        { backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.layoutText,
          { color: isDarkTheme ? '#FFFFFF' : '#000000' }
        ]}>
          {viewState.layoutOrientation === 'horizontal' ? '↔️' : '↕️'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
  },
  journeyInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  journeyInfo: {
    flex: 1,
  },
  journeyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  journeyDomain: {
    fontSize: 12,
    marginTop: 2,
  },
  detailButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '600',
  },
  layoutIndicator: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  layoutText: {
    fontSize: 18,
  },
});

export default HomeScreen;