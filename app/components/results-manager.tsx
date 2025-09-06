
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  FolderOpen, 
  Download, 
  Eye, 
  Search, 
  FileText, 
  Calendar,
  HardDrive,
  Database,
  Trash2,
  ExternalLink
} from 'lucide-react';
import type { ExtractionJob, ExtractionResult } from '@/lib/types';
import { toast } from 'sonner';

export function ResultsManager() {
  const [jobs, setJobs] = useState<ExtractionJob[]>([]);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExtractionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Fetch jobs and results
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsResponse, resultsResponse] = await Promise.all([
          fetch('/api/extraction/jobs'),
          fetch('/api/extraction/results')
        ]);

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }

        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          setResults(resultsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter results
  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(r => r.jobId === jobFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(r => r.subject === subjectFilter);
    }

    setFilteredResults(filtered);
  }, [results, searchTerm, jobFilter, subjectFilter]);

  const uniqueSubjects = [...new Set(results.map(r => r.subject))];
  const totalSize = results.reduce((sum, r) => sum + r.fileSize, 0);
  const totalQuestions = results.reduce((sum, r) => sum + r.questionCount, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (result: ExtractionResult) => {
    try {
      const response = await fetch(`/api/extraction/download/${result.id}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.fileName;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${result.fileName}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handlePreview = async (result: ExtractionResult) => {
    try {
      const response = await fetch(`/api/extraction/preview/${result.id}`);
      if (!response.ok) throw new Error('Preview failed');
      
      const data = await response.json();
      
      // Open preview in new window or modal
      const previewWindow = window.open('', '_blank', 'width=800,height=600');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head><title>Preview: ${result.fileName}</title></head>
            <body style="font-family: monospace; padding: 20px;">
              <h2>${result.fileName}</h2>
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview file');
    }
  };

  const handleDelete = async (result: ExtractionResult) => {
    if (!confirm(`Are you sure you want to delete ${result.fileName}?`)) return;

    try {
      const response = await fetch(`/api/extraction/results/${result.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setResults(prev => prev.filter(r => r.id !== result.id));
        toast.success('File deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleBulkDownload = async () => {
    try {
      const response = await fetch('/api/extraction/download/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resultIds: filteredResults.map(r => r.id) 
        })
      });

      if (!response.ok) throw new Error('Bulk download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `atpl-extraction-results-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Downloaded all results');
    } catch (error) {
      console.error('Bulk download error:', error);
      toast.error('Failed to download results');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
          <p>Loading results...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Results Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Results Overview
          </CardTitle>
          <CardDescription>
            Manage and download your extracted ATPL questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-blue-50 p-4 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{results.length}</p>
              <p className="text-xs text-blue-600">Total Files</p>
            </motion.div>

            <motion.div
              className="bg-green-50 p-4 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{totalQuestions.toLocaleString()}</p>
              <p className="text-xs text-green-600">Questions</p>
            </motion.div>

            <motion.div
              className="bg-purple-50 p-4 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HardDrive className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{formatFileSize(totalSize)}</p>
              <p className="text-xs text-purple-600">Storage Used</p>
            </motion.div>

            <motion.div
              className="bg-orange-50 p-4 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">{jobs.length}</p>
              <p className="text-xs text-orange-600">Total Jobs</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>
            Filter, search, and manage your extraction results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
              onClick={handleBulkDownload}
              disabled={filteredResults.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All ({filteredResults.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Extraction Results ({filteredResults.length})</CardTitle>
          <CardDescription>
            Individual files from your extraction jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found</p>
              <p className="text-sm">
                {results.length === 0 
                  ? 'Complete an extraction job to see results here'
                  : 'Try adjusting your search filters'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredResults.map((result, index) => {
                const job = jobs.find(j => j.id === result.jobId);
                
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <h3 className="font-medium text-gray-900 truncate">
                            {result.fileName}
                          </h3>
                          <Badge variant="secondary">
                            {result.subject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>{formatFileSize(result.fileSize)}</span>
                          <span>{result.questionCount.toLocaleString()} questions</span>
                          <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {job && (
                          <p className="text-xs text-gray-500">
                            From job: <strong>{job.name}</strong>
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(result)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(result)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(result)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
