
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, CheckSquare, X, Database } from 'lucide-react';
import { ATPL_SUBJECTS, type SubjectInfo } from '@/lib/types';
import { toast } from 'sonner';

interface SubjectSelectionProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  disabled?: boolean;
}

export function SubjectSelection({ selectedSubjects, onSubjectsChange, disabled }: SubjectSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('EASA 2020');
  const [subjects, setSubjects] = useState<SubjectInfo[]>(ATPL_SUBJECTS);

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubjectToggle = (subjectId: string) => {
    if (disabled) return;

    const newSelection = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter(id => id !== subjectId)
      : [...selectedSubjects, subjectId];
    
    onSubjectsChange(newSelection);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    
    if (selectedSubjects.length === filteredSubjects.length) {
      onSubjectsChange([]);
      toast.success('All subjects deselected');
    } else {
      onSubjectsChange(filteredSubjects.map(s => s.id));
      toast.success(`${filteredSubjects.length} subjects selected`);
    }
  };

  const handleClearSelection = () => {
    if (disabled) return;
    onSubjectsChange([]);
    toast.success('Selection cleared');
  };

  // Simulate loading question counts (in real implementation, fetch from API)
  useEffect(() => {
    const loadQuestionCounts = async () => {
      // Simulate API call to get question counts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubjects = ATPL_SUBJECTS.map(subject => ({
        ...subject,
        questionCount: Math.floor(Math.random() * 2000) + 500 // Mock data
      }));
      
      setSubjects(updatedSubjects);
    };

    loadQuestionCounts();
  }, [selectedDatabase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={disabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject Selection
          </CardTitle>
          <CardDescription>
            Choose which subjects to extract questions from. Select multiple subjects for comprehensive extraction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Database Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium">Database:</label>
              </div>
              <Select value={selectedDatabase} onValueChange={setSelectedDatabase} disabled={disabled}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASA 2020">EASA 2020</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                185,800+ Questions Available
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={disabled}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={disabled}
                className="whitespace-nowrap"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {selectedSubjects.length === filteredSubjects.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                disabled={disabled || selectedSubjects.length === 0}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedSubjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">Selection Summary</h4>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <span><strong>{selectedSubjects.length}</strong> subjects selected</span>
                  <span><strong>{selectedSubjects.reduce((total, id) => {
                    const subject = subjects.find(s => s.id === id);
                    return total + (subject?.questionCount || 0);
                  }, 0).toLocaleString()}</strong> total questions</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subject Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((subject, index) => {
              const isSelected = selectedSubjects.includes(subject.id);
              
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`
                    relative p-4 border rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                  onClick={() => handleSubjectToggle(subject.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={disabled}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {subject.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {subject.questionCount > 0 
                            ? `${subject.questionCount.toLocaleString()} questions`
                            : 'Loading...'
                          }
                        </Badge>
                        {isSelected && (
                          <Badge className="bg-blue-500 text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredSubjects.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No subjects found matching "{searchTerm}"</p>
            </div>
          )}

          {selectedSubjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800 text-sm">
                ✓ Ready to proceed with extraction. {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
