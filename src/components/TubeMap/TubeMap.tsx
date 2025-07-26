import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { G, Circle, Line, Text, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTubeMapStore } from '../../store/tubeMapStore';
import { Journey, Connection, Position } from '../../types';
import JourneyNode from './JourneyNode';
import ConnectionLine from './ConnectionLine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

interface TubeMapProps {
  onJourneyPress?: (journey: Journey) => void;
}

const TubeMap: React.FC<TubeMapProps> = ({ onJourneyPress }) => {
  const {
    tubeMapData,
    viewState,
    getFilteredJourneys,
    selectJourney,
    updateViewState,
  } = useTubeMapStore();

  const scale = useSharedValue(viewState.zoomLevel);
  const translateX = useSharedValue(viewState.centerPosition.x);
  const translateY = useSharedValue(viewState.centerPosition.y);

  const filteredJourneys = useMemo(() => getFilteredJourneys(), [getFilteredJourneys]);

  // Calculate tube map layout
  const mapLayout = useMemo(() => {
    const { layoutOrientation } = viewState;
    const journeys = filteredJourneys;
    
    if (layoutOrientation === 'horizontal') {
      // Horizontal tube map layout
      return journeys.map((journey, index) => ({
        ...journey,
        position: {
          x: 100 + (index % 6) * 180,
          y: 100 + Math.floor(index / 6) * 120
        }
      }));
    } else {
      // Vertical tube map layout
      return journeys.map((journey, index) => ({
        ...journey,
        position: {
          x: 100 + Math.floor(index / 6) * 180,
          y: 100 + (index % 6) * 120
        }
      }));
    }
  }, [filteredJourneys, viewState.layoutOrientation]);

  // Pan gesture handler
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX / scale.value;
      translateY.value = context.startY + event.translationY / scale.value;
    },
    onEnd: () => {
      runOnJS(updateViewState)({
        centerPosition: { x: translateX.value, y: translateY.value }
      });
    },
  });

  // Pinch gesture handler for zoom
  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      const newScale = Math.max(0.1, Math.min(3, context.startScale * event.scale));
      scale.value = newScale;
    },
    onEnd: () => {
      runOnJS(updateViewState)({
        zoomLevel: scale.value
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleJourneyPress = useCallback((journey: Journey) => {
    selectJourney(journey.id);
    onJourneyPress?.(journey);
  }, [selectJourney, onJourneyPress]);

  // Create connections between journeys
  const connections = useMemo(() => {
    const result: Array<{ from: Position; to: Position; connection: Connection }> = [];
    
    tubeMapData.connections.forEach(connection => {
      const fromJourney = mapLayout.find(j => j.id === connection.fromJourneyId);
      const toJourney = mapLayout.find(j => j.id === connection.toJourneyId);
      
      if (fromJourney && toJourney) {
        result.push({
          from: fromJourney.position,
          to: toJourney.position,
          connection
        });
      }
    });
    
    return result;
  }, [mapLayout, tubeMapData.connections]);

  return (
    <View style={[styles.container, { backgroundColor: viewState.theme === 'dark' ? '#1a1a1a' : '#f5f5f5' }]}>
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View style={styles.container}>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.mapContainer, animatedStyle]}>
              <Svg
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              >
                <Defs>
                  {/* Gradient definitions for different RAG statuses */}
                  <LinearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#66BB6A" stopOpacity="1" />
                  </LinearGradient>
                  <LinearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FF9800" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#FFB74D" stopOpacity="1" />
                  </LinearGradient>
                  <LinearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#F44336" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#EF5350" stopOpacity="1" />
                  </LinearGradient>
                  <LinearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#2196F3" stopOpacity="0.8" />
                    <Stop offset="100%" stopColor="#64B5F6" stopOpacity="0.6" />
                  </LinearGradient>
                </Defs>

                {/* Render connections first (behind nodes) */}
                <G>
                  {connections.map((conn, index) => (
                    <ConnectionLine
                      key={`connection-${index}`}
                      from={conn.from}
                      to={conn.to}
                      connection={conn.connection}
                      theme={viewState.theme}
                    />
                  ))}
                </G>

                {/* Render journey nodes */}
                <G>
                  {mapLayout.map((journey) => (
                    <JourneyNode
                      key={journey.id}
                      journey={journey}
                      position={journey.position}
                      isSelected={viewState.selectedJourneyId === journey.id}
                      onPress={() => handleJourneyPress(journey)}
                      showMetrics={viewState.showMetrics}
                      showPainPoints={viewState.showPainPoints}
                      theme={viewState.theme}
                    />
                  ))}
                </G>

                {/* Grid lines for reference (optional) */}
                {viewState.theme === 'light' && (
                  <G opacity={0.1}>
                    {Array.from({ length: Math.ceil(MAP_WIDTH / 100) }, (_, i) => (
                      <Line
                        key={`vline-${i}`}
                        x1={i * 100}
                        y1={0}
                        x2={i * 100}
                        y2={MAP_HEIGHT}
                        stroke="#666"
                        strokeWidth={1}
                      />
                    ))}
                    {Array.from({ length: Math.ceil(MAP_HEIGHT / 100) }, (_, i) => (
                      <Line
                        key={`hline-${i}`}
                        x1={0}
                        y1={i * 100}
                        x2={MAP_WIDTH}
                        y2={i * 100}
                        stroke="#666"
                        strokeWidth={1}
                      />
                    ))}
                  </G>
                )}
              </Svg>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TubeMap;