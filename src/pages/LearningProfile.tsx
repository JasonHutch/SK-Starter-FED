
import React, { useState } from 'react';
import { User, BookOpen, Save, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

const LearningProfile = () => {
  const [profile, setProfile] = useState({
    interests: '',
    learningStyle: '',
    teachingPreferences: '',
    experienceLevel: ''
  });

  const handleSave = () => {
    // TODO: Save to local storage or backend
    console.log('Saving profile:', profile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-3">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Learning Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="interests" className="text-sm font-medium text-gray-700">
                Interests & Topics
              </Label>
              <Textarea
                id="interests"
                placeholder="e.g., Machine Learning, Web Development, Data Science, React, Python..."
                value={profile.interests}
                onChange={(e) => setProfile(prev => ({ ...prev, interests: e.target.value }))}
                className="mt-2 min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tell us what subjects or technologies you're interested in learning about.
              </p>
            </div>
            
            <div>
              <Label htmlFor="learningStyle" className="text-sm font-medium text-gray-700">
                Learning Style
              </Label>
              <Input
                id="learningStyle"
                placeholder="e.g., Visual learner, Hands-on practice, Step-by-step explanations..."
                value={profile.learningStyle}
                onChange={(e) => setProfile(prev => ({ ...prev, learningStyle: e.target.value }))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                How do you prefer to learn new concepts?
              </p>
            </div>
            
            <div>
              <Label htmlFor="teachingPreferences" className="text-sm font-medium text-gray-700">
                Teaching Preferences
              </Label>
              <Textarea
                id="teachingPreferences"
                placeholder="e.g., Use real-world examples, provide code snippets, explain with analogies, include diagrams..."
                value={profile.teachingPreferences}
                onChange={(e) => setProfile(prev => ({ ...prev, teachingPreferences: e.target.value }))}
                className="mt-2 min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                How would you like the AI to explain things to you?
              </p>
            </div>
            
            <div>
              <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">
                Experience Level
              </Label>
              <Input
                id="experienceLevel"
                placeholder="e.g., Complete beginner, Some experience, Intermediate, Advanced..."
                value={profile.experienceLevel}
                onChange={(e) => setProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                What's your overall experience level in your areas of interest?
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Learning Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProfile;
