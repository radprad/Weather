export type RAGStatus = 'Red' | 'Amber' | 'Green';

export interface ArchitectureLayer {
  id: string;
  name: string;
  type: 'UI' | 'Mid-tier' | 'Database' | 'External';
  description: string;
  technologies: string[];
  dependencies: string[];
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impact: string;
  annotations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: RAGStatus;
  priority: 'Low' | 'Medium' | 'High';
  businessOutcome: string;
  features: Feature[];
  linkedFutureEpics: string[];
  estimatedEffort: number;
  domain: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  stories: Story[];
  dependencies: string[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  status: 'Backlog' | 'In Progress' | 'Done';
  acceptanceCriteria: string[];
}

export interface DomainDecomposition {
  id: string;
  name: string;
  description: string;
  regulatoryFramework: string;
  subDomains: SubDomain[];
  complianceRequirements: string[];
}

export interface SubDomain {
  id: string;
  name: string;
  description: string;
  services: string[];
  dataEntities: string[];
}

export interface JourneyMetrics {
  portfolioEpicsCount: number;
  linkedFutureEpicsCount: number;
  businessOutcomeMapping: string;
  featuresCount: number;
  storiesCount: number;
  ragStatus: RAGStatus;
  customMetrics?: Record<string, any>;
}

export interface SubJourney {
  id: string;
  name: string;
  description: string;
  architectureLayers: ArchitectureLayer[];
  painPoints: PainPoint[];
  metrics: Partial<JourneyMetrics>;
  position: Position;
  capabilities: string[];
  subJourneys?: SubJourney[];
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  domain: string;
  subJourneys: SubJourney[];
  architectureLayers: ArchitectureLayer[];
  painPoints: PainPoint[];
  epics: Epic[];
  metrics: JourneyMetrics;
  position: Position;
  capabilities: string[];
  domainDecomposition?: DomainDecomposition;
  connections: string[]; // Connected journey IDs
}

export interface Position {
  x: number;
  y: number;
}

export interface TubeMapData {
  journeys: Journey[];
  connections: Connection[];
  metadata: {
    version: string;
    lastUpdated: Date;
    totalJourneys: number;
  };
}

export interface Connection {
  id: string;
  fromJourneyId: string;
  toJourneyId: string;
  type: 'dependency' | 'sequence' | 'integration';
  description?: string;
}

export interface FilterCriteria {
  journeyName?: string;
  epicStatus?: RAGStatus[];
  domain?: string[];
  feature?: string;
  minRagStatus?: RAGStatus;
}

export interface ViewState {
  zoomLevel: number;
  centerPosition: Position;
  selectedJourneyId?: string;
  selectedSubJourneyId?: string;
  showArchitecture: boolean;
  showPainPoints: boolean;
  showMetrics: boolean;
  layoutOrientation: 'horizontal' | 'vertical';
  theme: 'light' | 'dark';
}

export interface SearchResult {
  type: 'journey' | 'subJourney' | 'epic' | 'feature';
  id: string;
  title: string;
  description: string;
  parentId?: string;
  relevanceScore: number;
}