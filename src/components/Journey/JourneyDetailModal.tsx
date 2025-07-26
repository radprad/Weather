import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Journey, RAGStatus } from '../../types';
import { useTubeMapStore } from '../../store/tubeMapStore';

interface JourneyDetailModalProps {
  visible: boolean;
  journey: Journey;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const JourneyDetailModal: React.FC<JourneyDetailModalProps> = ({
  visible,
  journey,
  onClose,
}) => {
  const { viewState } = useTubeMapStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'epics' | 'architecture' | 'painPoints' | 'domain'>('overview');
  
  const isDarkTheme = viewState.theme === 'dark';

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return '#D32F2F';
      case 'High':
        return '#F44336';
      case 'Medium':
        return '#FF9800';
      case 'Low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const renderTabButton = (tab: string, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab 
            ? '#2196F3' 
            : isDarkTheme ? '#333333' : '#F0F0F0',
        },
      ]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text
        style={[
          styles.tabButtonText,
          {
            color: activeTab === tab 
              ? '#FFFFFF' 
              : isDarkTheme ? '#FFFFFF' : '#000000',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Journey Header */}
      <View style={styles.section}>
        <Text style={[styles.journeyTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
          {journey.name}
        </Text>
        <Text style={[styles.journeyDomain, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
          {journey.domain}
        </Text>
        <Text style={[styles.journeyDescription, { color: isDarkTheme ? '#CCCCCC' : '#333333' }]}>
          {journey.description}
        </Text>
      </View>

      {/* Metrics Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
          Key Metrics
        </Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}>
            <Text style={[styles.metricValue, { color: getRAGStatusColor(journey.metrics.ragStatus) }]}>
              {journey.metrics.ragStatus}
            </Text>
            <Text style={[styles.metricLabel, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
              RAG Status
            </Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}>
            <Text style={[styles.metricValue, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {journey.metrics.portfolioEpicsCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
              Portfolio Epics
            </Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}>
            <Text style={[styles.metricValue, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {journey.metrics.featuresCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
              Features
            </Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}>
            <Text style={[styles.metricValue, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {journey.metrics.storiesCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
              Stories
            </Text>
          </View>
        </View>
      </View>

      {/* Business Outcome */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
          Business Outcome
        </Text>
        <Text style={[styles.businessOutcome, { color: isDarkTheme ? '#CCCCCC' : '#333333' }]}>
          {journey.metrics.businessOutcomeMapping}
        </Text>
      </View>

      {/* Capabilities */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
          Capabilities
        </Text>
        <View style={styles.capabilitiesContainer}>
          {journey.capabilities.map((capability, index) => (
            <View
              key={index}
              style={[styles.capabilityChip, { backgroundColor: isDarkTheme ? '#333333' : '#E3F2FD' }]}
            >
              <Text style={[styles.capabilityText, { color: isDarkTheme ? '#FFFFFF' : '#1976D2' }]}>
                {capability}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sub-journeys */}
      {journey.subJourneys.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            Sub-journeys ({journey.subJourneys.length})
          </Text>
          {journey.subJourneys.map((subJourney) => (
            <View
              key={subJourney.id}
              style={[styles.subJourneyCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}
            >
              <View style={styles.subJourneyHeader}>
                <Text style={[styles.subJourneyName, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
                  {subJourney.name}
                </Text>
                {subJourney.metrics?.ragStatus && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getRAGStatusColor(subJourney.metrics.ragStatus) },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{subJourney.metrics.ragStatus}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.subJourneyDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
                {subJourney.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderEpics = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
        Portfolio Epics ({journey.epics.length})
      </Text>
      {journey.epics.map((epic) => (
        <View
          key={epic.id}
          style={[styles.epicCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}
        >
          <View style={styles.epicHeader}>
            <Text style={[styles.epicTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {epic.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getRAGStatusColor(epic.status) }]}>
              <Text style={styles.statusBadgeText}>{epic.status}</Text>
            </View>
          </View>
          <Text style={[styles.epicDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
            {epic.description}
          </Text>
          <View style={styles.epicMetrics}>
            <Text style={[styles.epicMetric, { color: isDarkTheme ? '#BBBBBB' : '#888888' }]}>
              Priority: {epic.priority} • Features: {epic.features.length} • Domain: {epic.domain}
            </Text>
          </View>
          <Text style={[styles.businessOutcome, { color: isDarkTheme ? '#CCCCCC' : '#333333' }]}>
            📈 {epic.businessOutcome}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderArchitecture = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
        Architecture Layers ({journey.architectureLayers.length})
      </Text>
      {journey.architectureLayers.map((layer) => (
        <View
          key={layer.id}
          style={[styles.layerCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}
        >
          <View style={styles.layerHeader}>
            <Text style={[styles.layerName, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {layer.name}
            </Text>
            <View style={[styles.layerTypeBadge, { backgroundColor: getLayerTypeColor(layer.type) }]}>
              <Text style={styles.layerTypeText}>{layer.type}</Text>
            </View>
          </View>
          <Text style={[styles.layerDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
            {layer.description}
          </Text>
          <View style={styles.technologiesContainer}>
            <Text style={[styles.technologiesLabel, { color: isDarkTheme ? '#BBBBBB' : '#888888' }]}>
              Technologies:
            </Text>
            <View style={styles.technologiesChips}>
              {layer.technologies.map((tech, index) => (
                <View
                  key={index}
                  style={[styles.techChip, { backgroundColor: isDarkTheme ? '#444444' : '#E0E0E0' }]}
                >
                  <Text style={[styles.techChipText, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPainPoints = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
        Pain Points ({journey.painPoints.length})
      </Text>
      {journey.painPoints.map((painPoint) => (
        <View
          key={painPoint.id}
          style={[styles.painPointCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}
        >
          <View style={styles.painPointHeader}>
            <Text style={[styles.painPointTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {painPoint.title}
            </Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(painPoint.severity) }]}>
              <Text style={styles.severityBadgeText}>{painPoint.severity}</Text>
            </View>
          </View>
          <Text style={[styles.painPointDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
            {painPoint.description}
          </Text>
          <Text style={[styles.painPointImpact, { color: isDarkTheme ? '#CCCCCC' : '#333333' }]}>
            💥 Impact: {painPoint.impact}
          </Text>
          <View style={styles.annotationsContainer}>
            {painPoint.annotations.map((annotation, index) => (
              <View
                key={index}
                style={[styles.annotationChip, { backgroundColor: isDarkTheme ? '#444444' : '#E0E0E0' }]}
              >
                <Text style={[styles.annotationText, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>
                  {annotation}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderDomainDecomposition = () => (
    <View style={styles.tabContent}>
      {journey.domainDecomposition ? (
        <>
          <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            Domain Decomposition
          </Text>
          <View style={[styles.domainCard, { backgroundColor: isDarkTheme ? '#333333' : '#F8F9FA' }]}>
            <Text style={[styles.domainName, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
              {journey.domainDecomposition.name}
            </Text>
            <Text style={[styles.domainDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
              {journey.domainDecomposition.description}
            </Text>
            <Text style={[styles.regulatoryFramework, { color: isDarkTheme ? '#BBBBBB' : '#888888' }]}>
              📋 Regulatory Framework: {journey.domainDecomposition.regulatoryFramework}
            </Text>
            
            <View style={styles.complianceSection}>
              <Text style={[styles.complianceTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
                Compliance Requirements:
              </Text>
              {journey.domainDecomposition.complianceRequirements.map((requirement, index) => (
                <Text
                  key={index}
                  style={[styles.complianceItem, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}
                >
                  • {requirement}
                </Text>
              ))}
            </View>

            <View style={styles.subDomainsSection}>
              <Text style={[styles.subDomainsTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
                Sub-domains ({journey.domainDecomposition.subDomains.length}):
              </Text>
              {journey.domainDecomposition.subDomains.map((subDomain) => (
                <View
                  key={subDomain.id}
                  style={[styles.subDomainCard, { backgroundColor: isDarkTheme ? '#444444' : '#FFFFFF' }]}
                >
                  <Text style={[styles.subDomainName, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
                    {subDomain.name}
                  </Text>
                  <Text style={[styles.subDomainDescription, { color: isDarkTheme ? '#CCCCCC' : '#666666' }]}>
                    {subDomain.description}
                  </Text>
                  <Text style={[styles.subDomainServices, { color: isDarkTheme ? '#BBBBBB' : '#888888' }]}>
                    Services: {subDomain.services.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={[styles.noDataText, { color: isDarkTheme ? '#BBBBBB' : '#666666' }]}>
          No domain decomposition available for this journey.
        </Text>
      )}
    </View>
  );

  const getLayerTypeColor = (type: string) => {
    switch (type) {
      case 'UI':
        return '#2196F3';
      case 'Mid-tier':
        return '#FF9800';
      case 'Database':
        return '#4CAF50';
      case 'External':
        return '#9C27B0';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: isDarkTheme ? '#1A1A1A' : '#FFFFFF' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkTheme ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.headerTitle, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>
            Journey Details
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabNavigation, { backgroundColor: isDarkTheme ? '#2A2A2A' : '#F8F9FA' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContainer}>
            {renderTabButton('overview', 'Overview')}
            {renderTabButton('epics', 'Epics')}
            {renderTabButton('architecture', 'Architecture')}
            {renderTabButton('painPoints', 'Pain Points')}
            {renderTabButton('domain', 'Domain')}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'epics' && renderEpics()}
          {activeTab === 'architecture' && renderArchitecture()}
          {activeTab === 'painPoints' && renderPainPoints()}
          {activeTab === 'domain' && renderDomainDecomposition()}
        </ScrollView>
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
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999999',
  },
  tabNavigation: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  journeyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  journeyDomain: {
    fontSize: 16,
    marginBottom: 8,
  },
  journeyDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: (screenWidth - 64) / 2,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  businessOutcome: {
    fontSize: 16,
    lineHeight: 24,
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capabilityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  capabilityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subJourneyCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  subJourneyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subJourneyName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  subJourneyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  epicCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  epicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  epicTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  epicDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  epicMetrics: {
    marginBottom: 8,
  },
  epicMetric: {
    fontSize: 12,
  },
  layerCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  layerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  layerName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  layerTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  layerTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  layerDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  technologiesContainer: {
    marginTop: 8,
  },
  technologiesLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  technologiesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  techChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  techChipText: {
    fontSize: 12,
  },
  painPointCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  painPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  painPointTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  painPointDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  painPointImpact: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  annotationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  annotationChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  annotationText: {
    fontSize: 12,
  },
  domainCard: {
    padding: 16,
    borderRadius: 8,
  },
  domainName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  domainDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  regulatoryFramework: {
    fontSize: 14,
    marginBottom: 16,
  },
  complianceSection: {
    marginBottom: 16,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  complianceItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  subDomainsSection: {
    marginBottom: 16,
  },
  subDomainsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subDomainCard: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  subDomainName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  subDomainDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  subDomainServices: {
    fontSize: 11,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});

export default JourneyDetailModal;