
import React from 'react';
import { LearningProfile } from "@/components/LearningProfile";

export function TopNav() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
        <div className="flex items-center">
          <LearningProfile />
        </div>
      </div>
    </nav>
  );
}
