export enum AgentMode {
  AzureOnly = 'AzureOnly',
  TutorOnly = 'TutorOnly',
  QuizOnly = 'QuizOnly',
  HandoffOrchestration = 'HandoffOrchestration'
}

export const AgentModeLabels: Record<AgentMode, string> = {
  [AgentMode.AzureOnly]: 'Azure AI',
  [AgentMode.TutorOnly]: 'Tutor',
  [AgentMode.QuizOnly]: 'Quiz',
  [AgentMode.HandoffOrchestration]: 'Smart Handoff'
};

export const AgentModeDescriptions: Record<AgentMode, string> = {
  [AgentMode.AzureOnly]: 'Direct Azure AI assistance',
  [AgentMode.TutorOnly]: 'Educational tutoring assistant',
  [AgentMode.QuizOnly]: 'Interactive quiz generator',
  [AgentMode.HandoffOrchestration]: 'Intelligent agent switching'
};
