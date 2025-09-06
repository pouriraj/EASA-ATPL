
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Clock, 
  Database,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { ATPLCredentials, ExtractionJob, UserSettings } from '@/lib/types';
import { ATPL_SUBJECTS } from '@/lib/types';
import { toast } from 'sonner';

interface ExtractionControlsProps {
  credentials: ATPLCredentials | null;
  selectedSubjects: string[];
  settings: UserSettings;
  activeJob: ExtractionJob | null;
  onJobCreated: (job: ExtractionJob) => void;
  disabled?: boolean;
}

export function ExtractionControls({ 
  credentials, 
  selectedSubjects, 
  settings, 
  activeJob, 
  onJobCreated, 
  disabled 
}: ExtractionControlsProps) {
  const [jobName, setJobName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selectedSubjectNames = selectedSubjects.map(id => {
    const subject = ATPL_SUBJECTS.find(s => s.id === id);
    return subject?.name || id;
  });

  const estimatedQuestions = selectedSubjects.reduce((total, id) => {
    const subject = ATPL_SUBJECTS.find(s => s.id === id);
    return total + (subject?.questionCount || 1000); // Default estimate
  }, 0);

  const handleCreateJob = async () => {
    if (!credentials || selectedSubjects.length === 0) return;
    
    if (!jobName.trim()) {
      toast.error('Please enter a job name');
      return;
    }

    setIsCreating(true);
    
    try {
      const response = await fetch('/api/extraction/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: jobName.trim(),
          subjects: selectedSubjects,
          credentials,
          settings
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create extraction job');
      }

      const job = await response.json();
      onJobCreated(job);
      toast.success('Extraction job created successfully');
      
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create extraction job');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJobControl = async (action: 'start' | 'pause' | 'stop') => {
    if (!activeJob) return;

    try {
      const response = await fetch(`/api/extraction/${activeJob.id}/${action}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} job`);
      }

      const updatedJob = await response.json();
      
      // Refresh the job status by calling onJobCreated with updated job
      if (updatedJob.job) {
        onJobCreated(updatedJob.job);
      }

      toast.success(`Job ${action === 'start' ? 'started' : action === 'pause' ? 'paused' : 'stopped'}`);
      
      // Force a page refresh after 1 second to ensure UI updates
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      toast.error(`Failed to ${action} job`);
    }
  };

  // Generate default job name
  const generateJobName = () => {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const subjectCount = selectedSubjects.length;
    return `ATPL-Extract-${subjectCount}subjects-${date}`;
  };

  if (activeJob) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Extraction Job Controls
            </CardTitle>
            <CardDescription>
              Manage your active extraction job: {activeJob.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Job Status */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900">{activeJob.name}</h3>
                  <p className="text-sm text-blue-700">
                    Status: <Badge className={
                      activeJob.status === 'running' ? 'bg-green-500' :
                      activeJob.status === 'paused' ? 'bg-yellow-500' :
                      activeJob.status === 'completed' ? 'bg-blue-500' :
                      'bg-red-500'
                    }>
                      {activeJob.status.toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">
                    {activeJob.extractedQuestions} / {activeJob.totalQuestions} questions
                  </p>
                  <p className="text-xs text-blue-600">
                    {activeJob.failedQuestions} failed
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {activeJob.status === 'pending' || activeJob.status === 'paused' ? (
                  <Button
                    onClick={() => handleJobControl('start')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Extraction
                  </Button>
                ) : null}
                
                {activeJob.status === 'running' ? (
                  <Button
                    onClick={() => handleJobControl('pause')}
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : null}
                
                {activeJob.status !== 'completed' ? (
                  <Button
                    onClick={() => handleJobControl('stop')}
                    variant="destructive"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : null}
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Selected Subjects</Label>
                  <p className="text-gray-900">{typeof activeJob.subjects === 'string' ? (activeJob.subjects as string).split(',').length : (activeJob.subjects as any)?.length || 0} subjects</p>
                </div>
                <div>
                  <Label className="text-gray-600">Started</Label>
                  <p className="text-gray-900">
                    {activeJob.startTime 
                      ? new Date(activeJob.startTime).toLocaleString()
                      : 'Not started'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={disabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Create Extraction Job
          </CardTitle>
          <CardDescription>
            Configure and start your ATPL questions extraction job
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!credentials || selectedSubjects.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!credentials 
                  ? 'Please login with your ATPL credentials first'
                  : 'Please select at least one subject to extract'
                }
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {/* Job Configuration */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobName">Job Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="jobName"
                      placeholder="Enter a name for this extraction job"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      disabled={disabled}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setJobName(generateJobName())}
                      disabled={disabled}
                    >
                      Auto-name
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Extraction Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Extraction Preview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-gray-600">{settings.database}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Subjects</p>
                      <p className="text-gray-600">{selectedSubjects.length} selected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium">Est. Questions</p>
                      <p className="text-gray-600">{estimatedQuestions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-2">Selected subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSubjectNames.map(name => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Current Settings</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                  <div>Database: {settings.database}</div>
                  <div>Output Format: {settings.outputFormat.toUpperCase()}</div>
                  <div>Layout: {settings.spreadsheetLayout.replace('_', ' ')}</div>
                  <div>Retry Attempts: {settings.retryAttempts}</div>
                  <div>Request Delay: {settings.delayBetweenRequests}ms</div>
                  <div>Timeout: {settings.timeoutDuration}ms</div>
                  <div>Explanations: {settings.includeExplanations ? 'Yes' : 'No'}</div>
                  <div>Comments: {settings.includeComments ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* Create Job Button */}
              <Button
                onClick={handleCreateJob}
                className="w-full"
                disabled={disabled || !jobName.trim() || isCreating}
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Create Extraction Job
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This will create a new extraction job and prepare it for execution. 
                You can then start, pause, or stop the extraction as needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
