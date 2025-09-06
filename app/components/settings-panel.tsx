
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Clock, 
  Shield, 
  Database,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { UserSettings } from '@/lib/types';
import { toast } from 'sonner';

interface SettingsPanelProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);
    setHasChanges(hasChanges);
  }, [localSettings, settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings)
      });

      if (response.ok) {
        onSettingsChange(localSettings);
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings: UserSettings = {
      retryAttempts: 3,
      delayBetweenRequests: 1000,
      timeoutDuration: 30000,
      enableMediaExtraction: true,
      outputFormat: 'excel',
      database: 'EASA 2020',
      spreadsheetLayout: 'by_subject',
      includeExplanations: true,
      includeComments: true,
      includeMediaFiles: true,
      mediaDownloadFormat: 'original'
    };
    
    setLocalSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Extraction Settings
          </CardTitle>
          <CardDescription>
            Configure how the extraction system behaves during question extraction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Retry Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold">Retry Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Maximum Retry Attempts</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  min="0"
                  max="10"
                  value={localSettings.retryAttempts}
                  onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500">
                  Number of times to retry failed questions (0-10)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delayBetweenRequests">Request Delay (ms)</Label>
                <Input
                  id="delayBetweenRequests"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={localSettings.delayBetweenRequests}
                  onChange={(e) => updateSetting('delayBetweenRequests', parseInt(e.target.value) || 1000)}
                />
                <p className="text-xs text-gray-500">
                  Delay between requests to avoid rate limiting
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeout Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold">Timeout Configuration</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeoutDuration">Request Timeout (ms)</Label>
              <Input
                id="timeoutDuration"
                type="number"
                min="5000"
                max="120000"
                step="1000"
                value={localSettings.timeoutDuration}
                onChange={(e) => updateSetting('timeoutDuration', parseInt(e.target.value) || 30000)}
              />
              <p className="text-xs text-gray-500">
                Maximum time to wait for each request (5-120 seconds)
              </p>
            </div>
          </div>

          <Separator />

          {/* Media Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold">Content Extraction</h3>
            </div>
            
            <div className="flex items-center space-between">
              <div className="flex-1">
                <Label htmlFor="enableMediaExtraction">Extract Images and Media</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Download and save images, diagrams, and other media files
                </p>
              </div>
              <Switch
                id="enableMediaExtraction"
                checked={localSettings.enableMediaExtraction}
                onCheckedChange={(checked) => updateSetting('enableMediaExtraction', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Database Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold">Database Selection</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="database">Question Database</Label>
              <Select
                value={localSettings.database}
                onValueChange={(value: 'EASA 2020' | 'EASA 2020 All Questions') => updateSetting('database', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASA 2020">EASA 2020 (Curated Questions)</SelectItem>
                  <SelectItem value="EASA 2020 All Questions">EASA 2020 All Questions (Complete Database)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select which question database to use for extraction
              </p>
            </div>
          </div>

          <Separator />

          {/* Output Format Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold">Output Format & Layout</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outputFormat">Export Format</Label>
                <Select
                  value={localSettings.outputFormat}
                  onValueChange={(value: 'json' | 'csv' | 'xml' | 'excel') => updateSetting('outputFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx) - Recommended</SelectItem>
                    <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                    <SelectItem value="json">JSON (Data Format)</SelectItem>
                    <SelectItem value="xml">XML (Structured)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spreadsheetLayout">Spreadsheet Layout</Label>
                <Select
                  value={localSettings.spreadsheetLayout}
                  onValueChange={(value: 'single_sheet' | 'multiple_sheets' | 'by_subject' | 'by_subsection') => updateSetting('spreadsheetLayout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by_subject">By Subject (Recommended)</SelectItem>
                    <SelectItem value="by_subsection">By Subsection</SelectItem>
                    <SelectItem value="single_sheet">Single Sheet</SelectItem>
                    <SelectItem value="multiple_sheets">Multiple Files</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Configure how the extracted questions are organized in the output files
            </p>
          </div>

          <Separator />

          {/* Content Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold">Content Options</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="includeExplanations">Include Question Explanations</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Extract detailed explanations for each question
                  </p>
                </div>
                <Switch
                  id="includeExplanations"
                  checked={localSettings.includeExplanations}
                  onCheckedChange={(checked) => updateSetting('includeExplanations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="includeComments">Include User Comments</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Extract community comments and discussions
                  </p>
                </div>
                <Switch
                  id="includeComments"
                  checked={localSettings.includeComments}
                  onCheckedChange={(checked) => updateSetting('includeComments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="includeMediaFiles">Include Media Files</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Download images, diagrams, and other media content
                  </p>
                </div>
                <Switch
                  id="includeMediaFiles"
                  checked={localSettings.includeMediaFiles}
                  onCheckedChange={(checked) => updateSetting('includeMediaFiles', checked)}
                />
              </div>

              {localSettings.includeMediaFiles && (
                <div className="ml-4 space-y-2">
                  <Label htmlFor="mediaDownloadFormat">Media Download Format</Label>
                  <Select
                    value={localSettings.mediaDownloadFormat}
                    onValueChange={(value: 'original' | 'optimized' | 'both') => updateSetting('mediaDownloadFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original (Full Quality)</SelectItem>
                      <SelectItem value="optimized">Optimized (Smaller Size)</SelectItem>
                      <SelectItem value="both">Both Formats</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Choose quality vs file size for downloaded media
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Performance & Safety
          </CardTitle>
          <CardDescription>
            Recommendations based on your current settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {localSettings.delayBetweenRequests < 500 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Very low request delay may trigger rate limiting. 
                  Consider increasing to at least 500ms for better reliability.
                </AlertDescription>
              </Alert>
            )}

            {localSettings.retryAttempts > 5 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Notice:</strong> High retry attempts may significantly increase extraction time. 
                  Most failures resolve within 3 attempts.
                </AlertDescription>
              </Alert>
            )}

            {localSettings.timeoutDuration < 15000 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Short timeout may cause premature failures on slow connections. 
                  Recommended minimum is 15 seconds.
                </AlertDescription>
              </Alert>
            )}

            {localSettings.delayBetweenRequests >= 1000 && 
             localSettings.retryAttempts <= 3 && 
             localSettings.timeoutDuration >= 15000 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Optimal:</strong> Your settings are well-balanced for reliable extraction 
                  with good performance.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Performance Estimates */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Performance Estimate</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p><strong>Questions/minute:</strong> {Math.round(60000 / localSettings.delayBetweenRequests)}</p>
                <p><strong>Est. time for 1000 questions:</strong> {Math.round(localSettings.delayBetweenRequests * 1000 / 60000)} minutes</p>
              </div>
              <div>
                <p><strong>Failure recovery:</strong> Up to {localSettings.retryAttempts}x retry</p>
                <p><strong>Memory usage:</strong> {localSettings.enableMediaExtraction ? 'Higher' : 'Lower'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>

              {hasChanges && (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel Changes
                </Button>
              )}
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isSaving}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>

          {hasChanges && (
            <p className="text-xs text-amber-600 mt-2 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              You have unsaved changes
            </p>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings Warning */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> These settings affect extraction reliability and performance. 
          Test with a small subject selection before running large extractions with custom settings.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
