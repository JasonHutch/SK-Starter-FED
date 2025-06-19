import React from 'react';
import { Check, ChevronDown, Bot, GraduationCap, FileQuestion, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentMode, AgentModeLabels, AgentModeDescriptions } from '@/types/agentMode';
import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  selectedAgent: AgentMode;
  onAgentChange: (agent: AgentMode) => void;
  disabled?: boolean;
}

const AgentIcons: Record<AgentMode, React.ElementType> = {
  [AgentMode.AzureOnly]: Bot,
  [AgentMode.TutorOnly]: GraduationCap,
  [AgentMode.QuizOnly]: FileQuestion,
  [AgentMode.HandoffOrchestration]: Users,
};

const AgentColors: Record<AgentMode, string> = {
  [AgentMode.AzureOnly]: 'text-blue-600',
  [AgentMode.TutorOnly]: 'text-green-600',
  [AgentMode.QuizOnly]: 'text-purple-600',
  [AgentMode.HandoffOrchestration]: 'text-orange-600',
};

export function AgentSelector({ selectedAgent, onAgentChange, disabled = false }: AgentSelectorProps) {
  const SelectedIcon = AgentIcons[selectedAgent];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "flex items-center space-x-2 h-8 px-3 text-xs font-medium border-gray-200 hover:bg-gray-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <SelectedIcon className={cn("w-3 h-3", AgentColors[selectedAgent])} />
          <span className="hidden sm:inline">{AgentModeLabels[selectedAgent]}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {Object.values(AgentMode).map((mode) => {
          const Icon = AgentIcons[mode];
          const isSelected = mode === selectedAgent;
          
          return (
            <DropdownMenuItem
              key={mode}
              onClick={() => onAgentChange(mode)}
              className={cn(
                "flex items-center justify-between p-3 cursor-pointer",
                isSelected && "bg-blue-50"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className={cn("w-4 h-4", AgentColors[mode])} />
                <div>
                  <div className="font-medium text-sm">{AgentModeLabels[mode]}</div>
                  <div className="text-xs text-gray-500">{AgentModeDescriptions[mode]}</div>
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
