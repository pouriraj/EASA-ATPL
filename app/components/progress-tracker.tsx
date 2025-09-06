
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Pause,
  Zap,
  Database,
  TrendingUp
} from 'lucide-react';
import type { ExtractionJob } from '@/lib/types';

interface ProgressTrackerProps {
  activeJob: ExtractionJob | null;
}

export function ProgressTracker({ activeJob }: ProgressTrackerProps) {
  const [realtimeStats, setRealtimeStats] = useState({
    questionsPerMinute: 0,
    estimatedTimeRemaining: 0,
    currentSubject: '',
    lastExtracted: null as any
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!activeJob || activeJob.status !== 'running') return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/extraction/${activeJob.id}/stats`);
        if (response.ok) {
          const stats = await response.json();
          setRealtimeStats(stats);
        }
      } catch (error) {
        console.error('Error fetching real-time stats:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJob]);

  if (!activeJob) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Real-time extraction progress will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active extraction job</p>
              <p className="text-sm">Create and start an extraction job to view progress</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const progressPercentage = activeJob.totalQuestions > 0 
    ? Math.round((activeJob.extractedQuestions / activeJob.totalQuestions) * 100)
    : 0;

  const failureRate = activeJob.extractedQuestions > 0
    ? Math.round((activeJob.failedQuestions / (activeJob.extractedQuestions + activeJob.failedQuestions)) * 100)
    : 0;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Zap className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Extraction Progress
            </div>
            <Badge className={`${getStatusColor(activeJob.status)} text-white`}>
              {getStatusIcon(activeJob.status)}
              <span className="ml-1">{activeJob.status.toUpperCase()}</span>
            </Badge>
          </CardTitle>
          <CardDescription>
            {activeJob.name} - Real-time extraction progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {activeJob.extractedQuestions.toLocaleString()} / {activeJob.totalQuestions.toLocaleString()} questions
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{progressPercentage}% complete</span>
                {activeJob.status === 'running' && realtimeStats.estimatedTimeRemaining > 0 && (
                  <span className="text-xs text-gray-500">
                    Est. {formatDuration(realtimeStats.estimatedTimeRemaining)} remaining
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                className="bg-green-50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  {activeJob.extractedQuestions.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">Extracted</p>
              </motion.div>

              <motion.div
                className="bg-red-50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">
                  {activeJob.failedQuestions.toLocaleString()}
                </p>
                <p className="text-xs text-red-600">Failed ({failureRate}%)</p>
              </motion.div>

              <motion.div
                className="bg-blue-50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">
                  {realtimeStats.questionsPerMinute}
                </p>
                <p className="text-xs text-blue-600">Per Minute</p>
              </motion.div>

              <motion.div
                className="bg-purple-50 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Database className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">
                  {typeof activeJob.subjects === 'string' ? (activeJob.subjects as string).split(',').length : (activeJob.subjects as any)?.length || 0}
                </p>
                <p className="text-xs text-purple-600">Subjects</p>
              </motion.div>
            </div>

            {/* Current Activity */}
            {activeJob.status === 'running' && realtimeStats.currentSubject && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
              >
                <h4 className="font-semibold text-blue-800 mb-1">Currently Processing</h4>
                <p className="text-blue-700">{realtimeStats.currentSubject}</p>
                {realtimeStats.lastExtracted && (
                  <p className="text-xs text-blue-600 mt-1">
                    Last question extracted at {new Date(realtimeStats.lastExtracted).toLocaleTimeString()}
                  </p>
                )}
              </motion.div>
            )}

            {/* Time Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Started</p>
                <p className="font-medium">
                  {activeJob.startTime 
                    ? new Date(activeJob.startTime).toLocaleString()
                    : 'Not started'
                  }
                </p>
              </div>
              {activeJob.status === 'running' && activeJob.startTime && (
                <div>
                  <p className="text-gray-600">Running Time</p>
                  <p className="font-medium">
                    {formatDuration((Date.now() - new Date(activeJob.startTime).getTime()) / 60000)}
                  </p>
                </div>
              )}
              {activeJob.endTime && (
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="font-medium">
                    {new Date(activeJob.endTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Subject Progress
          </CardTitle>
          <CardDescription>
            Individual progress for each selected subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(typeof activeJob.subjects === 'string' ? (activeJob.subjects as string).split(',') : (activeJob.subjects as any) || []).map((subjectId: string, index: number) => {
              // In a real implementation, you'd fetch individual subject progress
              const mockProgress = Math.min(100, progressPercentage + Math.random() * 20 - 10);
              const subjectName = subjectId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
              
              return (
                <motion.div
                  key={subjectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-32 text-sm font-medium truncate">
                    {subjectName}
                  </div>
                  <div className="flex-1">
                    <Progress value={mockProgress} className="h-2" />
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {Math.round(mockProgress)}%
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
