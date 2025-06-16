
import React from 'react';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export function TopNav() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
        <div className="flex items-center">
          <Link to="/learning-profile">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Learning Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
