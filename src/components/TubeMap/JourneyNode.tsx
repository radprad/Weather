import React from 'react';
import { TouchableOpacity } from 'react-native';
import { G, Circle, Text, Rect } from 'react-native-svg';
import { Journey, Position } from '../../types';

interface JourneyNodeProps {
  journey: Journey;
  position: Position;
  isSelected: boolean;
  onPress: () => void;
  showMetrics: boolean;
  showPainPoints: boolean;
  theme: 'light' | 'dark';
}

const JourneyNode: React.FC<JourneyNodeProps> = ({
  journey,
  position,
  isSelected,
  onPress,
  showMetrics,
  showPainPoints,
  theme,
}) => {
  const getRAGColor = (ragStatus: string) => {
    switch (ragStatus) {
      case 'Green':
        return '#4CAF50';
      case 'Amber':
        return '#FF9800';
      case 'Red':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getRAGGradient = (ragStatus: string) => {
    switch (ragStatus) {
      case 'Green':
        return 'url(#greenGradient)';
      case 'Amber':
        return 'url(#amberGradient)';
      case 'Red':
        return 'url(#redGradient)';
      default:
        return '#9E9E9E';
    }
  };

  const nodeRadius = isSelected ? 35 : 25;
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const strokeColor = isSelected ? '#2196F3' : getRAGColor(journey.metrics.ragStatus);
  const strokeWidth = isSelected ? 3 : 2;
  
  // Calculate text positioning
  const textX = position.x;
  const textY = position.y + nodeRadius + 15;
  
  // Pain point indicator
  const hasPainPoints = journey.painPoints.length > 0;
  const highSeverityPainPoints = journey.painPoints.filter(pp => 
    pp.severity === 'High' || pp.severity === 'Critical'
  ).length;

  return (
    <G>
      {/* Main journey node circle */}
      <Circle
        cx={position.x}
        cy={position.y}
        r={nodeRadius}
        fill={getRAGGradient(journey.metrics.ragStatus)}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={0.9}
        onPress={onPress}
      />

      {/* Selection indicator */}
      {isSelected && (
        <Circle
          cx={position.x}
          cy={position.y}
          r={nodeRadius + 8}
          fill="none"
          stroke="#2196F3"
          strokeWidth={2}
          strokeDasharray="5,5"
          opacity={0.7}
        />
      )}

      {/* Pain point indicator */}
      {showPainPoints && hasPainPoints && (
        <Circle
          cx={position.x + nodeRadius - 8}
          cy={position.y - nodeRadius + 8}
          r={6}
          fill={highSeverityPainPoints > 0 ? '#F44336' : '#FF9800'}
          stroke="#FFFFFF"
          strokeWidth={1}
        />
      )}

      {/* Epic count indicator */}
      {showMetrics && (
        <G>
          <Circle
            cx={position.x - nodeRadius + 8}
            cy={position.y - nodeRadius + 8}
            r={8}
            fill="#2196F3"
            stroke="#FFFFFF"
            strokeWidth={1}
          />
          <Text
            x={position.x - nodeRadius + 8}
            y={position.y - nodeRadius + 8}
            textAnchor="middle"
            dy="3"
            fontSize="10"
            fill="#FFFFFF"
            fontWeight="bold"
          >
            {journey.metrics.portfolioEpicsCount}
          </Text>
        </G>
      )}

      {/* Journey name */}
      <Text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontSize={isSelected ? "14" : "12"}
        fontWeight={isSelected ? "bold" : "normal"}
        fill={textColor}
        maxWidth={nodeRadius * 3}
      >
        {journey.name}
      </Text>

      {/* Domain label */}
      <Text
        x={textX}
        y={textY + 15}
        textAnchor="middle"
        fontSize="10"
        fill={theme === 'dark' ? '#BBBBBB' : '#666666'}
        fontStyle="italic"
      >
        {journey.domain}
      </Text>

      {/* Metrics display when selected */}
      {isSelected && showMetrics && (
        <G>
          {/* Background for metrics */}
          <Rect
            x={position.x - 75}
            y={position.y + nodeRadius + 40}
            width={150}
            height={80}
            fill={theme === 'dark' ? '#333333' : '#FFFFFF'}
            stroke={theme === 'dark' ? '#555555' : '#CCCCCC'}
            strokeWidth={1}
            rx={8}
            ry={8}
            opacity={0.95}
          />
          
          {/* Metrics text */}
          <Text
            x={position.x}
            y={position.y + nodeRadius + 55}
            textAnchor="middle"
            fontSize="11"
            fill={textColor}
            fontWeight="bold"
          >
            Metrics
          </Text>
          
          <Text
            x={position.x}
            y={position.y + nodeRadius + 70}
            textAnchor="middle"
            fontSize="9"
            fill={textColor}
          >
            Epics: {journey.metrics.portfolioEpicsCount} | Features: {journey.metrics.featuresCount}
          </Text>
          
          <Text
            x={position.x}
            y={position.y + nodeRadius + 85}
            textAnchor="middle"
            fontSize="9"
            fill={textColor}
          >
            Stories: {journey.metrics.storiesCount} | RAG: {journey.metrics.ragStatus}
          </Text>
          
          <Text
            x={position.x}
            y={position.y + nodeRadius + 100}
            textAnchor="middle"
            fontSize="8"
            fill={theme === 'dark' ? '#BBBBBB' : '#666666'}
            maxWidth={140}
          >
            {journey.metrics.businessOutcomeMapping}
          </Text>
        </G>
      )}

      {/* Sub-journey indicators */}
      {journey.subJourneys.length > 0 && (
        <G>
          {journey.subJourneys.slice(0, 3).map((subJourney, index) => {
            const angle = (index * 120) * (Math.PI / 180);
            const subX = position.x + Math.cos(angle) * (nodeRadius + 15);
            const subY = position.y + Math.sin(angle) * (nodeRadius + 15);
            
            return (
              <Circle
                key={subJourney.id}
                cx={subX}
                cy={subY}
                r={8}
                fill={subJourney.metrics?.ragStatus ? getRAGColor(subJourney.metrics.ragStatus) : '#9E9E9E'}
                stroke="#FFFFFF"
                strokeWidth={1}
                opacity={0.8}
              />
            );
          })}
          
          {/* More indicator if there are more than 3 sub-journeys */}
          {journey.subJourneys.length > 3 && (
            <Text
              x={position.x}
              y={position.y + nodeRadius + 25}
              textAnchor="middle"
              fontSize="8"
              fill={theme === 'dark' ? '#BBBBBB' : '#666666'}
            >
              +{journey.subJourneys.length - 3} more
            </Text>
          )}
        </G>
      )}
    </G>
  );
};

export default JourneyNode;