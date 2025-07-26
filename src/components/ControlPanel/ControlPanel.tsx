import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTubeMapStore } from '../../store/tubeMapStore';

interface ControlPanelProps {
  onLayoutToggle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onLayoutToggle,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const { viewState, updateViewState } = useTubeMapStore();
  const isDarkTheme = viewState.theme === 'dark';

  const toggleShowMetrics = () => {
    updateViewState({ showMetrics: !viewState.showMetrics });
  };

  const toggleShowPainPoints = () => {
    updateViewState({ showPainPoints: !viewState.showPainPoints });
  };

  const toggleShowArchitecture = () => {
    updateViewState({ showArchitecture: !viewState.showArchitecture });
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkTheme ? '#2A2A2A' : '#FFFFFF' }
    ]}>
      {/* Zoom Controls */}
      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
          onPress={onZoomIn}
        >
          <Text style={[styles.controlButtonText, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            +
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
          onPress={onZoomOut}
        >
          <Text style={[styles.controlButtonText, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            −
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
          onPress={onResetZoom}
        >
          <Text style={[styles.controlIcon, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            🎯
          </Text>
        </TouchableOpacity>
      </View>

      {/* Layout Controls */}
      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isDarkTheme ? '#333333' : '#F0F0F0' }]}
          onPress={onLayoutToggle}
        >
          <Text style={[styles.controlIcon, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            {viewState.layoutOrientation === 'horizontal' ? '↔️' : '↕️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* View Options */}
      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: viewState.showMetrics
                ? '#2196F3'
                : isDarkTheme ? '#333333' : '#F0F0F0'
            }
          ]}
          onPress={toggleShowMetrics}
        >
          <Text style={[
            styles.controlIcon,
            { color: viewState.showMetrics ? '#FFFFFF' : isDarkTheme ? '#FFFFFF' : '#000000' }
          ]}>
            📊
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: viewState.showPainPoints
                ? '#F44336'
                : isDarkTheme ? '#333333' : '#F0F0F0'
            }
          ]}
          onPress={toggleShowPainPoints}
        >
          <Text style={[
            styles.controlIcon,
            { color: viewState.showPainPoints ? '#FFFFFF' : isDarkTheme ? '#FFFFFF' : '#000000' }
          ]}>
            ⚠️
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: viewState.showArchitecture
                ? '#4CAF50'
                : isDarkTheme ? '#333333' : '#F0F0F0'
            }
          ]}
          onPress={toggleShowArchitecture}
        >
          <Text style={[
            styles.controlIcon,
            { color: viewState.showArchitecture ? '#FFFFFF' : isDarkTheme ? '#FFFFFF' : '#000000' }
          ]}>
            🏗️
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    padding: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  controlGroup: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  controlButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlIcon: {
    fontSize: 16,
  },
});

export default ControlPanel;