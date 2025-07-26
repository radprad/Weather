import React from 'react';
import { G, Line, Path, Circle, Text } from 'react-native-svg';
import { Position, Connection } from '../../types';

interface ConnectionLineProps {
  from: Position;
  to: Position;
  connection: Connection;
  theme: 'light' | 'dark';
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  from,
  to,
  connection,
  theme,
}) => {
  const getConnectionStyle = (type: string) => {
    switch (type) {
      case 'dependency':
        return {
          color: '#2196F3',
          strokeWidth: 3,
          dashArray: '0',
          opacity: 0.8,
        };
      case 'sequence':
        return {
          color: '#4CAF50',
          strokeWidth: 4,
          dashArray: '0',
          opacity: 0.9,
        };
      case 'integration':
        return {
          color: '#FF9800',
          strokeWidth: 2,
          dashArray: '5,5',
          opacity: 0.7,
        };
      default:
        return {
          color: '#9E9E9E',
          strokeWidth: 2,
          dashArray: '0',
          opacity: 0.6,
        };
    }
  };

  const style = getConnectionStyle(connection.type);

  // Calculate the path to avoid overlapping with nodes
  const nodeRadius = 25;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate start and end points that don't overlap with node circles
  const startX = from.x + (dx / distance) * nodeRadius;
  const startY = from.y + (dy / distance) * nodeRadius;
  const endX = to.x - (dx / distance) * nodeRadius;
  const endY = to.y - (dy / distance) * nodeRadius;

  // Create a curved path for better visual appeal
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Add some curvature based on the connection type
  const curvature = connection.type === 'integration' ? 20 : 10;
  const controlX = midX + (dy / distance) * curvature;
  const controlY = midY - (dx / distance) * curvature;

  const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  // Arrow head for directional connections
  const arrowSize = 8;
  const angle = Math.atan2(endY - controlY, endX - controlX);
  const arrowX1 = endX - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = endY - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = endX - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = endY - arrowSize * Math.sin(angle + Math.PI / 6);

  return (
    <G>
      {/* Main connection line */}
      <Path
        d={pathData}
        stroke={style.color}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.dashArray}
        fill="none"
        opacity={style.opacity}
      />

      {/* Arrow head for dependency and sequence connections */}
      {(connection.type === 'dependency' || connection.type === 'sequence') && (
        <G>
          <Line
            x1={endX}
            y1={endY}
            x2={arrowX1}
            y2={arrowY1}
            stroke={style.color}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
          <Line
            x1={endX}
            y1={endY}
            x2={arrowX2}
            y2={arrowY2}
            stroke={style.color}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
        </G>
      )}

      {/* Connection type indicator */}
      <Circle
        cx={midX}
        cy={midY}
        r={6}
        fill={style.color}
        opacity={0.9}
      />
      
      {/* Connection type icon/text */}
      <Text
        x={midX}
        y={midY}
        textAnchor="middle"
        dy="2"
        fontSize="8"
        fill="#FFFFFF"
        fontWeight="bold"
      >
        {connection.type === 'dependency' ? 'D' : 
         connection.type === 'sequence' ? 'S' : 
         connection.type === 'integration' ? 'I' : '?'}
      </Text>

      {/* Connection description on hover/selection (simplified for mobile) */}
      {connection.description && (
        <Text
          x={midX}
          y={midY + 20}
          textAnchor="middle"
          fontSize="8"
          fill={theme === 'dark' ? '#BBBBBB' : '#666666'}
          opacity={0.8}
          maxWidth={100}
        >
          {connection.description.length > 30 
            ? connection.description.substring(0, 30) + '...' 
            : connection.description}
        </Text>
      )}
    </G>
  );
};

export default ConnectionLine;