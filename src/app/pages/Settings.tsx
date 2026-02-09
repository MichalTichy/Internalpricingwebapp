import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, RotateCcw } from 'lucide-react';

export function Settings() {
  const [threshold, setThreshold] = useState('0.75');
  const [itemLimit, setItemLimit] = useState('50');
  const [prompt, setPrompt] = useState(
    `Analyze the catalogue items in {{ItemsToSearch}} and find the best match for {{SearchedItem}}. Consider technical specifications, dimensions, and compatibility.`
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Mock save
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const handleReset = () => {
    setThreshold('0.75');
    setItemLimit('50');
    setPrompt(
      `Analyze the catalogue items in {{ItemsToSearch}} and find the best match for {{SearchedItem}}. Consider technical specifications, dimensions, and compatibility.`
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure catalogue search and AI matching parameters</p>
      </div>

      <Card className="p-6">
        <div className="space-y-8">
          
          {/* Section: Search Parameters */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Match Threshold (0.0 - 1.0)"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
              <Input
                label="Default Item Limit"
                type="number"
                min="1"
                max="1000"
                value={itemLimit}
                onChange={(e) => setItemLimit(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Section: AI Prompt */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">AI Post-filtering Prompt</h3>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-3 w-3" />
                Reset to default
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Define the instructions for the AI model when filtering search results. 
              You can use the placeholders <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{ItemsToSearch}}'}</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{SearchedItem}}'}</code>.
            </p>

            <textarea
              rows={8}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0072BC] focus:ring-[#0072BC] sm:text-sm p-3 font-mono text-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} isLoading={isSaving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
