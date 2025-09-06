
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { SubjectSelection } from './subject-selection';
import { ExtractionControls } from './extraction-controls';
import { ProgressTracker } from './progress-tracker';
import { ErrorReporting } from './error-reporting';
import { ResultsManager } from './results-manager';
import { SettingsPanel } from './settings-panel';
import { LogsDisplay } from './logs-display';
import { UserGuide } from './user-guide';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  BookOpen, 
  Play, 
  BarChart3, 
  AlertTriangle, 
  FolderOpen, 
  Settings, 
  FileText,
  Loader2,
  HelpCircle
} from 'lucide-react';
import type { ATPLCredentials, ExtractionJob, UserSettings } from '@/lib/types';
import { toast } from 'sonner';

export function MainDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState<ATPLCredentials | null>(null);
  const [activeJob, setActiveJob] = useState<ExtractionJob | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
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
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('login');

  // Auto-advance tabs based on completion
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('login');
    } else if (selectedSubjects.length === 0 && !activeJob) {
      setActiveTab('subjects');
    }
  }, [isAuthenticated, selectedSubjects.length, activeJob]);

  const handleLogin = (creds: ATPLCredentials) => {
    setCredentials(creds);
    setIsAuthenticated(true);
    setActiveTab('subjects');
    toast.success('Successfully authenticated with ATPL Questions');
  };

  const handleSubjectsSelected = (subjects: string[]) => {
    setSelectedSubjects(subjects);
    if (subjects.length > 0) {
      setActiveTab('extraction');
    }
  };

  const handleJobCreated = (job: ExtractionJob) => {
    setActiveJob(job);
    setActiveTab('progress');
    toast.success('Extraction job created successfully');
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      login: User,
      subjects: BookOpen,
      extraction: Play,
      progress: BarChart3,
      errors: AlertTriangle,
      results: FolderOpen,
      settings: Settings,
      logs: FileText,
      help: HelpCircle
    };
    const Icon = icons[tab as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4 mr-2" /> : null;
  };

  const getTabStatus = (tab: string) => {
    switch (tab) {
      case 'login':
        return isAuthenticated ? 'completed' : 'active';
      case 'subjects':
        return selectedSubjects.length > 0 ? 'completed' : isAuthenticated ? 'active' : 'locked';
      case 'extraction':
        return activeJob ? 'completed' : selectedSubjects.length > 0 ? 'active' : 'locked';
      case 'progress':
        return activeJob && activeJob.status === 'running' ? 'active' : 'locked';
      default:
        return 'available';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">✓</Badge>;
      case 'active':
        return <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">Active</Badge>;
      case 'locked':
        return <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-500">Locked</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-7xl mx-auto shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-2xl">
            <BookOpen className="h-6 w-6 mr-3" />
            ATPL Questions Extraction Dashboard
          </CardTitle>
          <CardDescription className="text-blue-100">
            Complete workflow for extracting and managing ATPL questions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-6">
              {[
                { id: 'login', label: 'Login' },
                { id: 'subjects', label: 'Subjects' },
                { id: 'extraction', label: 'Extract' },
                { id: 'progress', label: 'Progress' },
                { id: 'errors', label: 'Errors' },
                { id: 'results', label: 'Results' },
                { id: 'settings', label: 'Settings' },
                { id: 'logs', label: 'Logs' },
                { id: 'help', label: 'Help' }
              ].map(tab => {
                const status = getTabStatus(tab.id);
                const disabled = status === 'locked';
                
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={disabled}
                    className="flex items-center text-xs relative"
                  >
                    {getTabIcon(tab.id)}
                    {tab.label}
                    {getStatusBadge(status)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="login" className="mt-0">
                  <LoginForm onLogin={handleLogin} isAuthenticated={isAuthenticated} credentials={credentials} />
                </TabsContent>

                <TabsContent value="subjects" className="mt-0">
                  <SubjectSelection 
                    selectedSubjects={selectedSubjects}
                    onSubjectsChange={handleSubjectsSelected}
                    disabled={!isAuthenticated}
                  />
                </TabsContent>

                <TabsContent value="extraction" className="mt-0">
                  <ExtractionControls
                    credentials={credentials}
                    selectedSubjects={selectedSubjects}
                    settings={settings}
                    activeJob={activeJob}
                    onJobCreated={handleJobCreated}
                    disabled={!isAuthenticated || selectedSubjects.length === 0}
                  />
                </TabsContent>

                <TabsContent value="progress" className="mt-0">
                  <ProgressTracker activeJob={activeJob} />
                </TabsContent>

                <TabsContent value="errors" className="mt-0">
                  <ErrorReporting activeJob={activeJob} />
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  <ResultsManager />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <SettingsPanel settings={settings} onSettingsChange={setSettings} />
                </TabsContent>

                <TabsContent value="logs" className="mt-0">
                  <LogsDisplay activeJob={activeJob} />
                </TabsContent>

                <TabsContent value="help" className="mt-0">
                  <UserGuide />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
