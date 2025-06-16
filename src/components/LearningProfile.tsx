
import React, { useState } from 'react';
import { User, BookOpen, Save, Edit3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function LearningProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    interests: '',
    learningStyle: '',
    teachingPreferences: '',
    experienceLevel: ''
  });

  const handleSave = () => {
    // TODO: Save to local storage or backend
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start h-auto p-2 hover:bg-gray-100"
        >
          <User className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">Learning Profile</span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
        <div className="space-y-4 mt-2 p-3 bg-gray-50 rounded-lg">
          {!isEditing ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-600">Interests</Label>
                <p className="text-sm text-gray-800 mt-1">
                  {profile.interests || 'Not set'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600">Learning Style</Label>
                <p className="text-sm text-gray-800 mt-1">
                  {profile.learningStyle || 'Not set'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600">Teaching Preferences</Label>
                <p className="text-sm text-gray-800 mt-1">
                  {profile.teachingPreferences || 'Not set'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600">Experience Level</Label>
                <p className="text-sm text-gray-800 mt-1">
                  {profile.experienceLevel || 'Not set'}
                </p>
              </div>
              
              <Button 
                onClick={handleEdit}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <Edit3 className="h-3 w-3 mr-2" />
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="interests" className="text-xs font-medium text-gray-600">
                  Interests & Topics
                </Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., Machine Learning, Web Development, Data Science..."
                  value={profile.interests}
                  onChange={(e) => setProfile(prev => ({ ...prev, interests: e.target.value }))}
                  className="mt-1 text-sm min-h-[60px]"
                />
              </div>
              
              <div>
                <Label htmlFor="learningStyle" className="text-xs font-medium text-gray-600">
                  Learning Style
                </Label>
                <Input
                  id="learningStyle"
                  placeholder="e.g., Visual, Hands-on, Step-by-step..."
                  value={profile.learningStyle}
                  onChange={(e) => setProfile(prev => ({ ...prev, learningStyle: e.target.value }))}
                  className="mt-1 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="teachingPreferences" className="text-xs font-medium text-gray-600">
                  Teaching Preferences
                </Label>
                <Textarea
                  id="teachingPreferences"
                  placeholder="e.g., Use examples, explain with analogies, show code snippets..."
                  value={profile.teachingPreferences}
                  onChange={(e) => setProfile(prev => ({ ...prev, teachingPreferences: e.target.value }))}
                  className="mt-1 text-sm min-h-[60px]"
                />
              </div>
              
              <div>
                <Label htmlFor="experienceLevel" className="text-xs font-medium text-gray-600">
                  Experience Level
                </Label>
                <Input
                  id="experienceLevel"
                  placeholder="e.g., Beginner, Intermediate, Advanced..."
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="mt-1 text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-3 w-3 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
