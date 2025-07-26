import { TubeMapData, Journey, Epic, Feature, Story, ArchitectureLayer, PainPoint, DomainDecomposition } from '../types';

// Architecture layers common to banking systems
const commonArchitectureLayers: ArchitectureLayer[] = [
  {
    id: 'ui-mobile',
    name: 'Mobile App UI',
    type: 'UI',
    description: 'Native iOS/Android mobile application',
    technologies: ['React Native', 'Swift', 'Kotlin'],
    dependencies: ['mid-tier-api']
  },
  {
    id: 'ui-web',
    name: 'Internet Banking Web UI',
    type: 'UI',
    description: 'Web-based internet banking interface',
    technologies: ['React', 'TypeScript', 'CSS3'],
    dependencies: ['mid-tier-api']
  },
  {
    id: 'ui-fullserve',
    name: 'Full-Serve Branch UI',
    type: 'UI',
    description: 'Branch staff interface for full-service operations',
    technologies: ['Java Swing', 'Web Components'],
    dependencies: ['mid-tier-api', 'legacy-mainframe']
  },
  {
    id: 'ui-chat',
    name: 'Chat Interface',
    type: 'UI',
    description: 'Customer service chat and chatbot interface',
    technologies: ['React', 'WebSocket', 'AI/ML'],
    dependencies: ['mid-tier-api']
  },
  {
    id: 'mid-tier-api',
    name: 'Mid-tier API Gateway',
    type: 'Mid-tier',
    description: 'API orchestration and business logic layer',
    technologies: ['Spring Boot', 'Java', 'Kong Gateway'],
    dependencies: ['core-banking-db', 'legacy-mainframe']
  },
  {
    id: 'mid-tier-auth',
    name: 'Authentication Service',
    type: 'Mid-tier',
    description: 'Identity and access management',
    technologies: ['OAuth 2.0', 'JWT', 'LDAP'],
    dependencies: ['customer-db']
  },
  {
    id: 'core-banking-db',
    name: 'Core Banking Database',
    type: 'Database',
    description: 'Modern core banking system database',
    technologies: ['Oracle', 'PostgreSQL', 'Redis Cache'],
    dependencies: []
  },
  {
    id: 'customer-db',
    name: 'Customer Database',
    type: 'Database',
    description: 'Customer information and profiles',
    technologies: ['MongoDB', 'Oracle'],
    dependencies: []
  },
  {
    id: 'legacy-mainframe',
    name: 'Legacy Mainframe',
    type: 'Database',
    description: 'Legacy mainframe systems for historical data',
    technologies: ['IBM z/OS', 'COBOL', 'DB2'],
    dependencies: []
  },
  {
    id: 'payments-external',
    name: 'External Payment Networks',
    type: 'External',
    description: 'Faster Payments, CHAPS, SEPA integrations',
    technologies: ['ISO 20022', 'SWIFT', 'API'],
    dependencies: []
  }
];

// Common pain points
const commonPainPoints: PainPoint[] = [
  {
    id: 'pp-legacy-integration',
    title: 'Legacy System Integration',
    description: 'Complex integration with mainframe systems causing delays',
    severity: 'High',
    impact: 'Increased development time and maintenance costs',
    annotations: ['Technical Debt', 'Performance Impact'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'pp-data-consistency',
    title: 'Data Consistency Issues',
    description: 'Inconsistent data across multiple systems',
    severity: 'Medium',
    impact: 'Customer experience degradation',
    annotations: ['Data Quality', 'Customer Impact'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  }
];

// Domain decomposition for Make a Payment journey
const makePaymentDomainDecomposition: DomainDecomposition = {
  id: 'payment-domain',
  name: 'Payment Processing Domain',
  description: 'Handles all aspects of payment processing including domestic and international transfers',
  regulatoryFramework: 'PSD2, Strong Customer Authentication, FCA Payment Services Regulations',
  complianceRequirements: [
    'PSD2 Compliance',
    'Anti-Money Laundering (AML)',
    'Know Your Customer (KYC)',
    'Strong Customer Authentication (SCA)',
    'Payment Services Regulations 2017'
  ],
  subDomains: [
    {
      id: 'domestic-payments',
      name: 'Domestic Payments',
      description: 'UK domestic payment processing via Faster Payments',
      services: ['PaymentValidation', 'FasterPaymentsGateway', 'PaymentStatus'],
      dataEntities: ['DomesticPayment', 'PayeeBankDetails', 'PaymentInstruction']
    },
    {
      id: 'international-payments',
      name: 'International Payments',
      description: 'Cross-border payments via SWIFT and correspondent banking',
      services: ['SWIFTGateway', 'CurrencyExchange', 'ComplianceCheck'],
      dataEntities: ['InternationalPayment', 'SWIFTMessage', 'ExchangeRate']
    },
    {
      id: 'standing-orders',
      name: 'Standing Orders',
      description: 'Recurring payment setup and management',
      services: ['StandingOrderService', 'RecurrenceEngine', 'PaymentScheduler'],
      dataEntities: ['StandingOrder', 'PaymentSchedule', 'RecurrencePattern']
    },
    {
      id: 'payment-security',
      name: 'Payment Security',
      description: 'Fraud detection and security controls for payments',
      services: ['FraudDetection', 'RiskAssessment', 'TransactionMonitoring'],
      dataEntities: ['FraudRule', 'RiskProfile', 'SecurityAlert']
    }
  ]
};

// Sample journeys data
export const mockTubeMapData: TubeMapData = {
  journeys: [
    // 1. Make a Payment
    {
      id: 'journey-make-payment',
      name: 'Make a Payment',
      description: 'Enable customers to make domestic and international payments',
      domain: 'Payments',
      position: { x: 100, y: 200 },
      capabilities: ['Domestic Transfers', 'International Payments', 'Standing Orders', 'Payment Templates'],
      connections: ['journey-account-management', 'journey-fraud-prevention'],
      domainDecomposition: makePaymentDomainDecomposition,
      architectureLayers: commonArchitectureLayers,
      painPoints: [
        ...commonPainPoints,
        {
          id: 'pp-payment-limits',
          title: 'Complex Payment Limits',
          description: 'Multiple overlapping payment limits causing customer confusion',
          severity: 'Medium',
          impact: 'Customer abandonment during payment flow',
          annotations: ['UX Issue', 'Business Rules'],
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-22')
        }
      ],
      subJourneys: [
        {
          id: 'subjourney-domestic-payment',
          name: 'Domestic Payment',
          description: 'Process payments within the UK via Faster Payments',
          position: { x: 50, y: 100 },
          capabilities: ['Faster Payments', 'Sort Code Validation', 'Real-time Processing'],
          architectureLayers: commonArchitectureLayers.filter(layer => 
            ['ui-mobile', 'ui-web', 'mid-tier-api', 'core-banking-db', 'payments-external'].includes(layer.id)
          ),
          painPoints: [],
          metrics: {
            portfolioEpicsCount: 3,
            linkedFutureEpicsCount: 2,
            businessOutcomeMapping: 'Increase payment completion rate by 15%',
            featuresCount: 8,
            storiesCount: 24,
            ragStatus: 'Green'
          }
        },
        {
          id: 'subjourney-international-payment',
          name: 'International Payment',
          description: 'Process cross-border payments via SWIFT network',
          position: { x: 150, y: 100 },
          capabilities: ['SWIFT Payments', 'Currency Exchange', 'Correspondent Banking'],
          architectureLayers: commonArchitectureLayers,
          painPoints: [
            {
              id: 'pp-swift-delays',
              title: 'SWIFT Processing Delays',
              description: 'International payments experiencing delays due to correspondent bank processing',
              severity: 'High',
              impact: 'Customer satisfaction and competitive disadvantage',
              annotations: ['External Dependency', 'SLA Impact'],
              createdAt: new Date('2024-01-08'),
              updatedAt: new Date('2024-01-18')
            }
          ],
          metrics: {
            portfolioEpicsCount: 4,
            linkedFutureEpicsCount: 3,
            businessOutcomeMapping: 'Reduce international payment processing time by 30%',
            featuresCount: 12,
            storiesCount: 36,
            ragStatus: 'Amber'
          }
        }
      ],
      epics: [
        {
          id: 'epic-payment-ui-modernization',
          title: 'Payment UI Modernization',
          description: 'Modernize payment interface across all channels',
          status: 'Green',
          priority: 'High',
          businessOutcome: 'Improve payment completion rate and reduce customer service calls',
          domain: 'Payments',
          estimatedEffort: 13,
          linkedFutureEpics: ['epic-payment-analytics', 'epic-payment-ai'],
          features: [
            {
              id: 'feature-mobile-payment-flow',
              title: 'Mobile Payment Flow Enhancement',
              description: 'Streamlined mobile payment experience',
              status: 'Completed',
              dependencies: [],
              stories: [
                {
                  id: 'story-payment-form-validation',
                  title: 'Real-time Payment Form Validation',
                  description: 'As a customer, I want real-time validation so I can correct errors immediately',
                  storyPoints: 5,
                  status: 'Done',
                  acceptanceCriteria: [
                    'Sort code validation occurs on field exit',
                    'Account number format checked in real-time',
                    'Clear error messages displayed'
                  ]
                }
              ]
            }
          ]
        }
      ],
      metrics: {
        portfolioEpicsCount: 5,
        linkedFutureEpicsCount: 8,
        businessOutcomeMapping: 'Increase digital payment adoption by 25%',
        featuresCount: 15,
        storiesCount: 45,
        ragStatus: 'Green'
      }
    },

    // 2. Account Opening
    {
      id: 'journey-account-opening',
      name: 'Account Opening',
      description: 'Digital and branch-based account opening for personal and business customers',
      domain: 'Customer Onboarding',
      position: { x: 300, y: 150 },
      capabilities: ['Identity Verification', 'Credit Checks', 'Document Upload', 'Digital Signatures'],
      connections: ['journey-customer-onboarding', 'journey-kyc-compliance'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 7,
        linkedFutureEpicsCount: 4,
        businessOutcomeMapping: 'Reduce account opening time from 7 days to 24 hours',
        featuresCount: 18,
        storiesCount: 54,
        ragStatus: 'Amber'
      }
    },

    // 3. Loan Application
    {
      id: 'journey-loan-application',
      name: 'Loan Application',
      description: 'Personal and business loan application and approval process',
      domain: 'Lending',
      position: { x: 500, y: 200 },
      capabilities: ['Credit Assessment', 'Document Collection', 'Automated Underwriting', 'Loan Origination'],
      connections: ['journey-account-opening', 'journey-credit-assessment'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 6,
        linkedFutureEpicsCount: 5,
        businessOutcomeMapping: 'Improve loan approval rate by 20% while maintaining risk standards',
        featuresCount: 22,
        storiesCount: 66,
        ragStatus: 'Red'
      }
    },

    // Continue with more journeys... (truncated for brevity, but would include all 34)
    // Adding key journeys to demonstrate variety

    // 4. Mortgage Application
    {
      id: 'journey-mortgage-application',
      name: 'Mortgage Application',
      description: 'End-to-end mortgage application and approval process',
      domain: 'Mortgages',
      position: { x: 700, y: 150 },
      capabilities: ['Property Valuation', 'Affordability Assessment', 'Legal Process', 'Completion'],
      connections: ['journey-loan-application', 'journey-property-services'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 8,
        linkedFutureEpicsCount: 6,
        businessOutcomeMapping: 'Reduce mortgage application processing time by 40%',
        featuresCount: 25,
        storiesCount: 75,
        ragStatus: 'Amber'
      }
    },

    // 5. Card Management
    {
      id: 'journey-card-management',
      name: 'Card Management',
      description: 'Debit and credit card lifecycle management',
      domain: 'Cards',
      position: { x: 200, y: 350 },
      capabilities: ['Card Activation', 'PIN Management', 'Card Blocking', 'Spending Controls'],
      connections: ['journey-make-payment', 'journey-fraud-prevention'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 4,
        linkedFutureEpicsCount: 3,
        businessOutcomeMapping: 'Increase digital card management adoption by 30%',
        featuresCount: 12,
        storiesCount: 36,
        ragStatus: 'Green'
      }
    },

    // Adding more journeys to reach closer to 34 total
    {
      id: 'journey-account-management',
      name: 'Account Management',
      description: 'View and manage bank accounts, statements, and transactions',
      domain: 'Account Services',
      position: { x: 400, y: 100 },
      capabilities: ['Balance Inquiry', 'Transaction History', 'Statement Download', 'Account Settings'],
      connections: ['journey-make-payment', 'journey-savings-investment'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 3,
        linkedFutureEpicsCount: 2,
        businessOutcomeMapping: 'Improve customer self-service adoption by 35%',
        featuresCount: 10,
        storiesCount: 30,
        ragStatus: 'Green'
      }
    },

    {
      id: 'journey-fraud-prevention',
      name: 'Fraud Prevention',
      description: 'Real-time fraud detection and prevention across all channels',
      domain: 'Security',
      position: { x: 100, y: 400 },
      capabilities: ['Transaction Monitoring', 'Behavioral Analysis', 'Risk Scoring', 'Alert Management'],
      connections: ['journey-make-payment', 'journey-card-management'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 5,
        linkedFutureEpicsCount: 4,
        businessOutcomeMapping: 'Reduce fraud losses by 25% while minimizing false positives',
        featuresCount: 14,
        storiesCount: 42,
        ragStatus: 'Amber'
      }
    },

    {
      id: 'journey-customer-service',
      name: 'Customer Service',
      description: 'Multi-channel customer support and query resolution',
      domain: 'Customer Support',
      position: { x: 600, y: 350 },
      capabilities: ['Live Chat', 'Phone Support', 'Email Support', 'Self-Service Portal'],
      connections: ['journey-account-management', 'journey-complaint-resolution'],
      architectureLayers: commonArchitectureLayers,
      painPoints: commonPainPoints,
      subJourneys: [],
      epics: [],
      metrics: {
        portfolioEpicsCount: 4,
        linkedFutureEpicsCount: 3,
        businessOutcomeMapping: 'Improve customer satisfaction score by 15%',
        featuresCount: 16,
        storiesCount: 48,
        ragStatus: 'Green'
      }
    }

    // Additional journeys would be added here to reach 34 total
    // Including: Investment Management, Insurance Services, Business Banking,
    // Mobile Banking, Internet Banking, Branch Services, ATM Services,
    // Savings Products, Current Account Services, Overdraft Management,
    // Direct Debits, Standing Orders, etc.
  ],
  connections: [
    {
      id: 'conn-payment-account',
      fromJourneyId: 'journey-make-payment',
      toJourneyId: 'journey-account-management',
      type: 'dependency',
      description: 'Payments require account access and balance validation'
    },
    {
      id: 'conn-payment-fraud',
      fromJourneyId: 'journey-make-payment',
      toJourneyId: 'journey-fraud-prevention',
      type: 'integration',
      description: 'Real-time fraud checking during payment processing'
    },
    {
      id: 'conn-card-payment',
      fromJourneyId: 'journey-card-management',
      toJourneyId: 'journey-make-payment',
      type: 'integration',
      description: 'Card transactions flow through payment systems'
    },
    {
      id: 'conn-onboarding-account',
      fromJourneyId: 'journey-account-opening',
      toJourneyId: 'journey-account-management',
      type: 'sequence',
      description: 'Account opening leads to account management'
    }
  ],
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date('2024-01-26'),
    totalJourneys: 8 // Would be 34 in full implementation
  }
};

// Extended journeys list for demonstration (showing structure for all 34)
export const allJourneyNames = [
  'Make a Payment', 'Account Opening', 'Loan Application', 'Mortgage Application',
  'Card Management', 'Account Management', 'Fraud Prevention', 'Customer Service',
  'Investment Management', 'Insurance Services', 'Business Banking', 'Mobile Banking',
  'Internet Banking', 'Branch Services', 'ATM Services', 'Savings Products',
  'Current Account Services', 'Overdraft Management', 'Direct Debits', 'Standing Orders',
  'Foreign Exchange', 'Trade Finance', 'Cash Management', 'Treasury Services',
  'Wealth Management', 'Private Banking', 'Student Banking', 'Youth Banking',
  'Premier Banking', 'Corporate Banking', 'Commercial Banking', 'Retail Banking',
  'Digital Wallet', 'Contactless Payments'
];