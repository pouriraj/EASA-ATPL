
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Search, 
  Filter,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { ExtractionJob, FailedQuestion } from '@/lib/types';
import { toast } from 'sonner';

interface ErrorReportingProps {
  activeJob: ExtractionJob | null;
}

export function ErrorReporting({ activeJob }: ErrorReportingProps) {
  const [failedQuestions, setFailedQuestions] = useState<FailedQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<FailedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [retryingQuestions, setRetryingQuestions] = useState<Set<string>>(new Set());

  // Fetch failed questions
  useEffect(() => {
    if (!activeJob) {
      setFailedQuestions([]);
      return;
    }

    const fetchFailedQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/extraction/${activeJob.id}/failed`);
        if (response.ok) {
          const data = await response.json();
          setFailedQuestions(data);
        }
      } catch (error) {
        console.error('Error fetching failed questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFailedQuestions();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchFailedQuestions, 10000);
    return () => clearInterval(interval);
  }, [activeJob]);

  // Filter questions based on search and subject
  useEffect(() => {
    let filtered = failedQuestions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(q => q.subject === subjectFilter);
    }

    setFilteredQuestions(filtered);
  }, [failedQuestions, searchTerm, subjectFilter]);

  const uniqueSubjects = [...new Set(failedQuestions.map(q => q.subject))];

  const handleRetryQuestion = async (questionId: string) => {
    if (!activeJob) return;

    setRetryingQuestions(prev => new Set(prev).add(questionId));
    
    try {
      const response = await fetch(`/api/extraction/${activeJob.id}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      });

      if (response.ok) {
        toast.success('Question retry initiated');
        // Remove from failed list if successful
        setFailedQuestions(prev => prev.filter(q => q.questionId !== questionId));
      } else {
        toast.error('Failed to retry question');
      }
    } catch (error) {
      console.error('Error retrying question:', error);
      toast.error('Failed to retry question');
    } finally {
      setRetryingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const handleRetryAll = async () => {
    if (!activeJob || filteredQuestions.length === 0) return;

    const questionIds = filteredQuestions.map(q => q.questionId);
    
    try {
      const response = await fetch(`/api/extraction/${activeJob.id}/retry-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds })
      });

      if (response.ok) {
        toast.success(`Retrying ${questionIds.length} questions`);
        // Clear failed questions that are being retried
        setFailedQuestions(prev => 
          prev.filter(q => !questionIds.includes(q.questionId))
        );
      } else {
        toast.error('Failed to retry questions');
      }
    } catch (error) {
      console.error('Error retrying questions:', error);
      toast.error('Failed to retry questions');
    }
  };

  const handleExportErrors = () => {
    const csvContent = [
      ['Question ID', 'Subject', 'Error', 'Retry Count', 'URL', 'Timestamp'],
      ...filteredQuestions.map(q => [
        q.questionId,
        q.subject,
        q.error,
        q.retryCount,
        q.url || '',
        new Date(q.timestamp).toLocaleString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `failed-questions-${activeJob?.name || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Error report exported');
  };

  const getErrorSeverity = (error: string): "default" | "secondary" | "destructive" | "outline" => {
    if (error.toLowerCase().includes('timeout')) return 'secondary';
    if (error.toLowerCase().includes('not found') || error.toLowerCase().includes('404')) return 'destructive';
    if (error.toLowerCase().includes('auth') || error.toLowerCase().includes('401')) return 'destructive';
    return 'secondary';
  };

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
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Reporting
            </CardTitle>
            <CardDescription>
              Failed questions and error details will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active extraction job</p>
              <p className="text-sm">Error reporting requires an active job</p>
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
      className="space-y-6"
    >
      {/* Error Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Summary
            </div>
            <Badge variant={failedQuestions.length > 0 ? 'destructive' : 'secondary'}>
              {failedQuestions.length} Failed Questions
            </Badge>
          </CardTitle>
          <CardDescription>
            Overview of extraction errors and failed questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {failedQuestions.length === 0 ? (
            <div className="text-center py-8 text-green-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No errors detected</p>
              <p className="text-sm">All questions extracted successfully</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">{failedQuestions.length}</p>
                <p className="text-xs text-red-600">Total Failures</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <RefreshCw className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-700">
                  {failedQuestions.filter(q => q.retryCount > 0).length}
                </p>
                <p className="text-xs text-yellow-600">Retried Questions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Filter className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">{uniqueSubjects.length}</p>
                <p className="text-xs text-blue-600">Affected Subjects</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {failedQuestions.length > 0 && (
        <>
          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Error Management</CardTitle>
              <CardDescription>
                Filter, retry, and export failed questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by question ID, error message, or URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {uniqueSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRetryAll}
                  disabled={filteredQuestions.length === 0}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry All ({filteredQuestions.length})
                </Button>
                <Button
                  onClick={handleExportErrors}
                  variant="outline"
                  disabled={filteredQuestions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Errors
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Failed Questions List */}
          <Card>
            <CardHeader>
              <CardTitle>Failed Questions ({filteredQuestions.length})</CardTitle>
              <CardDescription>
                Detailed list of questions that failed extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p>Loading failed questions...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {question.questionId}
                            </Badge>
                            <Badge variant="secondary">
                              {question.subject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <Badge variant={getErrorSeverity(question.error)}>
                              Retry: {question.retryCount}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-red-700 bg-red-50 p-2 rounded mb-2">
                            <strong>Error:</strong> {question.error}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(question.timestamp).toLocaleString()}
                            </div>
                            {question.url && (
                              <a
                                href={question.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Question
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryQuestion(question.questionId)}
                          disabled={retryingQuestions.has(question.questionId)}
                          className="ml-4"
                        >
                          {retryingQuestions.has(question.questionId) ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Retrying
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {filteredQuestions.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No failed questions match your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
