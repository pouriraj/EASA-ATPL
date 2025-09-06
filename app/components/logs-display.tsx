
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Pause, 
  Play,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';
import type { ExtractionJob, ExtractionLog } from '@/lib/types';
import { toast } from 'sonner';

interface LogsDisplayProps {
  activeJob: ExtractionJob | null;
}

export function LogsDisplay({ activeJob }: LogsDisplayProps) {
  const [logs, setLogs] = useState<ExtractionLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ExtractionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fetch logs for active job
  useEffect(() => {
    if (!activeJob) {
      setLogs([]);
      return;
    }

    const fetchLogs = async () => {
      if (isPaused) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/extraction/${activeJob.id}/logs`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    
    // Set up polling for real-time updates
    const interval = activeJob.status === 'running' && !isPaused 
      ? setInterval(fetchLogs, 2000) 
      : null;
      
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeJob, isPaused]);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && !isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll, isPaused]);

  const handleExportLogs = () => {
    if (filteredLogs.length === 0) {
      toast.error('No logs to export');
      return;
    }

    const csvContent = [
      ['Timestamp', 'Level', 'Message', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.level,
        log.message,
        log.details || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extraction-logs-${activeJob?.name || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exported successfully');
  };

  const handleClearLogs = async () => {
    if (!activeJob) return;
    
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/extraction/${activeJob.id}/logs`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLogs([]);
        toast.success('Logs cleared successfully');
      } else {
        throw new Error('Failed to clear logs');
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Failed to clear logs');
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  const logLevelCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
              <FileText className="h-5 w-5 mr-2" />
              System Logs
            </CardTitle>
            <CardDescription>
              Real-time extraction logs and system messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active extraction job</p>
              <p className="text-sm">Logs will appear when an extraction job is running</p>
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
      {/* Log Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Log Statistics
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
                className={isPaused ? 'bg-yellow-50 border-yellow-300' : ''}
              >
                {isPaused ? (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time system logs for {activeJob.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-gray-50 p-3 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-bold text-gray-700">{logs.length}</p>
              <p className="text-xs text-gray-600">Total Logs</p>
            </motion.div>

            <motion.div
              className="bg-red-50 p-3 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-bold text-red-700">{logLevelCounts.error || 0}</p>
              <p className="text-xs text-red-600">Errors</p>
            </motion.div>

            <motion.div
              className="bg-yellow-50 p-3 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-bold text-yellow-700">{logLevelCounts.warning || 0}</p>
              <p className="text-xs text-yellow-600">Warnings</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-3 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-bold text-blue-700">{logLevelCounts.info || 0}</p>
              <p className="text-xs text-blue-600">Info</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Log Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Log Controls</CardTitle>
          <CardDescription>
            Filter, search, and manage extraction logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Errors Only</SelectItem>
                <SelectItem value="warning">Warnings Only</SelectItem>
                <SelectItem value="info">Info Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoScroll"
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
                <Label htmlFor="autoScroll" className="text-sm">Auto-scroll</Label>
              </div>
              
              {isPaused && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Updates Paused
                </Badge>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportLogs}
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearLogs}
                disabled={logs.length === 0}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle>Live Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>
            Real-time extraction progress and system messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto border rounded-lg bg-gray-900 text-green-400 font-mono text-sm">
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Loading logs...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <FileText className="h-6 w-6 mr-2" />
                No logs match your filters
              </div>
            ) : (
              <div className="p-4 space-y-2">
                <AnimatePresence>
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start space-x-3 p-2 rounded ${
                        log.level === 'error' ? 'bg-red-900/20 text-red-400' :
                        log.level === 'warning' ? 'bg-yellow-900/20 text-yellow-400' :
                        log.level === 'info' ? 'bg-blue-900/20 text-blue-400' :
                        'bg-gray-800 text-green-400'
                      }`}
                    >
                      {getLogIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <Badge variant={getLogBadgeVariant(log.level)} className="text-xs">
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="mt-1 break-words">{log.message}</p>
                        {log.details && (
                          <p className="mt-1 text-xs text-gray-500 break-words">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
