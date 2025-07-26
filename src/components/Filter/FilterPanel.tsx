import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useTubeMapStore } from '../../store/tubeMapStore';
import { FilterCriteria, RAGStatus } from '../../types';

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ visible, onClose }) => {
  const {
    filterCriteria,
    setFilterCriteria,
    tubeMapData,
    viewState,
  } = useTubeMapStore();

  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filterCriteria);

  const isDarkTheme = viewState.theme === 'dark';

  // Extract unique domains from journeys
  const uniqueDomains = Array.from(
    new Set(tubeMapData.journeys.map(journey => journey.domain))
  ).sort();

  const ragStatuses: RAGStatus[] = ['Red', 'Amber', 'Green'];

  const handleDomainToggle = (domain: string) => {
    const currentDomains = localFilters.domain || [];
    const newDomains = currentDomains.includes(domain)
      ? currentDomains.filter(d => d !== domain)
      : [...currentDomains, domain];
    
    setLocalFilters({
      ...localFilters,
      domain: newDomains.length > 0 ? newDomains : undefined,
    });
  };

  const handleRAGStatusToggle = (status: RAGStatus) => {
    const currentStatuses = localFilters.epicStatus || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    setLocalFilters({
      ...localFilters,
      epicStatus: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleApplyFilters = () => {
    setFilterCriteria(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterCriteria = {
      journeyName: undefined,
      epicStatus: undefined,
      domain: undefined,
      feature: undefined,
      minRagStatus: undefined,
    };
    setLocalFilters(clearedFilters);
    setFilterCriteria(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.journeyName) count++;
    if (localFilters.domain && localFilters.domain.length > 0) count++;
    if (localFilters.epicStatus && localFilters.epicStatus.length > 0) count++;
    if (localFilters.feature) count++;
    if (localFilters.minRagStatus) count++;
    return count;
  };

  const getRAGStatusColor = (status: RAGStatus) => {
    switch (status) {
      case 'Green':
        return '#4CAF50';
      case 'Amber':
        return '#FF9800';
      case 'Red':
        return '#F44336';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkTheme ? '#1A1A1A' : '#F5F5F5' },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDarkTheme ? '#2A2A2A' : '#FFFFFF',
              borderBottomColor: isDarkTheme ? '#333333' : '#E0E0E0',
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: isDarkTheme ? '#FFFFFF' : '#000000' },
            ]}
          >
            Filter Journeys
          </Text>
          <View style={styles.headerActions}>
            {getActiveFilterCount() > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Journey Name Filter */}
          <View style={styles.filterSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkTheme ? '#FFFFFF' : '#000000' },
              ]}
            >
              Journey Name
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
                  borderColor: isDarkTheme ? '#555555' : '#DDDDDD',
                  color: isDarkTheme ? '#FFFFFF' : '#000000',
                },
              ]}
              placeholder="Search by journey name..."
              placeholderTextColor={isDarkTheme ? '#BBBBBB' : '#666666'}
              value={localFilters.journeyName || ''}
              onChangeText={(text) =>
                setLocalFilters({
                  ...localFilters,
                  journeyName: text.trim() || undefined,
                })
              }
            />
          </View>

          {/* Domain Filter */}
          <View style={styles.filterSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkTheme ? '#FFFFFF' : '#000000' },
              ]}
            >
              Domain ({localFilters.domain?.length || 0} selected)
            </Text>
            <View style={styles.chipContainer}>
              {uniqueDomains.map((domain) => {
                const isSelected = localFilters.domain?.includes(domain) || false;
                return (
                  <TouchableOpacity
                    key={domain}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? '#2196F3'
                          : isDarkTheme
                          ? '#333333'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? '#2196F3'
                          : isDarkTheme
                          ? '#555555'
                          : '#DDDDDD',
                      },
                    ]}
                    onPress={() => handleDomainToggle(domain)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDarkTheme
                            ? '#FFFFFF'
                            : '#000000',
                        },
                      ]}
                    >
                      {domain}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* RAG Status Filter */}
          <View style={styles.filterSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkTheme ? '#FFFFFF' : '#000000' },
              ]}
            >
              RAG Status ({localFilters.epicStatus?.length || 0} selected)
            </Text>
            <View style={styles.chipContainer}>
              {ragStatuses.map((status) => {
                const isSelected = localFilters.epicStatus?.includes(status) || false;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? getRAGStatusColor(status)
                          : isDarkTheme
                          ? '#333333'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? getRAGStatusColor(status)
                          : isDarkTheme
                          ? '#555555'
                          : '#DDDDDD',
                      },
                    ]}
                    onPress={() => handleRAGStatusToggle(status)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDarkTheme
                            ? '#FFFFFF'
                            : '#000000',
                        },
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Minimum RAG Status Filter */}
          <View style={styles.filterSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkTheme ? '#FFFFFF' : '#000000' },
              ]}
            >
              Minimum RAG Status
            </Text>
            <View style={styles.chipContainer}>
              {ragStatuses.map((status) => {
                const isSelected = localFilters.minRagStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? getRAGStatusColor(status)
                          : isDarkTheme
                          ? '#333333'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? getRAGStatusColor(status)
                          : isDarkTheme
                          ? '#555555'
                          : '#DDDDDD',
                      },
                    ]}
                    onPress={() =>
                      setLocalFilters({
                        ...localFilters,
                        minRagStatus: isSelected ? undefined : status,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDarkTheme
                            ? '#FFFFFF'
                            : '#000000',
                        },
                      ]}
                    >
                      {status}+
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Feature Filter */}
          <View style={styles.filterSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkTheme ? '#FFFFFF' : '#000000' },
              ]}
            >
              Feature
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
                  borderColor: isDarkTheme ? '#555555' : '#DDDDDD',
                  color: isDarkTheme ? '#FFFFFF' : '#000000',
                },
              ]}
              placeholder="Search by feature name..."
              placeholderTextColor={isDarkTheme ? '#BBBBBB' : '#666666'}
              value={localFilters.feature || ''}
              onChangeText={(text) =>
                setLocalFilters({
                  ...localFilters,
                  feature: text.trim() || undefined,
                })
              }
            />
          </View>

          {/* Filter Summary */}
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDarkTheme ? '#FFFFFF' : '#000000' },
                ]}
              >
                Active Filters ({getActiveFilterCount()})
              </Text>
              <View style={styles.summaryContainer}>
                {localFilters.journeyName && (
                  <Text
                    style={[
                      styles.summaryText,
                      { color: isDarkTheme ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    • Journey: "{localFilters.journeyName}"
                  </Text>
                )}
                {localFilters.domain && localFilters.domain.length > 0 && (
                  <Text
                    style={[
                      styles.summaryText,
                      { color: isDarkTheme ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    • Domains: {localFilters.domain.join(', ')}
                  </Text>
                )}
                {localFilters.epicStatus && localFilters.epicStatus.length > 0 && (
                  <Text
                    style={[
                      styles.summaryText,
                      { color: isDarkTheme ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    • RAG Status: {localFilters.epicStatus.join(', ')}
                  </Text>
                )}
                {localFilters.minRagStatus && (
                  <Text
                    style={[
                      styles.summaryText,
                      { color: isDarkTheme ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    • Min RAG: {localFilters.minRagStatus}+
                  </Text>
                )}
                {localFilters.feature && (
                  <Text
                    style={[
                      styles.summaryText,
                      { color: isDarkTheme ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    • Feature: "{localFilters.feature}"
                  </Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDarkTheme ? '#2A2A2A' : '#FFFFFF',
              borderTopColor: isDarkTheme ? '#333333' : '#E0E0E0',
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>
              Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF9800',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryContainer: {
    padding: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#999999',
  },
  cancelButtonText: {
    color: '#999999',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#2196F3',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterPanel;