

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Monitor,
  Settings,
  Download,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Globe,
  FileText,
  Folder,
  HelpCircle,
  Database
} from 'lucide-react';

export function UserGuide() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Access the ATPL GUI',
      description: 'Open your web browser and navigate to this application',
      details: 'The GUI runs in your web browser. No installation required - just open and use.',
      icon: Monitor,
      time: '1 minute'
    },
    {
      step: 2,
      title: 'Login with Your ATPL Credentials',
      description: 'Enter your atplquestions.com username and password',
      details: 'Use the same credentials you use to access atplquestions.com. Your credentials are only used for authentication and are not stored.',
      icon: Globe,
      time: '1 minute'
    },
    {
      step: 3,
      title: 'Choose Your Database Version',
      description: 'Select between EASA 2020 or EASA 2020 All Questions',
      details: 'Go to Settings tab to choose your preferred database. EASA 2020 has curated questions, while All Questions includes the complete archive.',
      icon: Database,
      time: '1 minute'
    },
    {
      step: 4,
      title: 'Select Aviation Subjects',
      description: 'Choose which subjects you want to extract',
      details: 'Pick from 13 aviation subjects like Air Law, Meteorology, Navigation, etc. You can select all or just the ones you need.',
      icon: BookOpen,
      time: '2 minutes'
    },
    {
      step: 5,
      title: 'Configure Output Settings',
      description: 'Set how you want your data organized',
      details: 'Choose Excel format, spreadsheet layout, and what content to include (explanations, comments, media files).',
      icon: Settings,
      time: '2 minutes'
    },
    {
      step: 6,
      title: 'Start Extraction',
      description: 'Create and run your extraction job',
      details: 'Give your job a name and click to start. You can monitor progress, pause, or stop anytime.',
      icon: Play,
      time: 'Varies (minutes to hours)'
    }
  ];

  const databaseOptions = [
    {
      name: 'EASA 2020',
      description: 'Curated collection of high-quality questions for exam preparation',
      features: ['Quality-focused', 'Faster extraction', 'Exam-relevant questions', 'Recommended for study'],
      recommended: true,
      estimatedSize: '~50,000 questions'
    },
    {
      name: 'EASA 2020 All Questions',
      description: 'Complete database including historical and practice questions',
      features: ['Complete archive', 'All variations', 'Historical questions', 'Comprehensive collection'],
      recommended: false,
      estimatedSize: '~185,800 questions'
    }
  ];

  const outputFormats = [
    {
      format: 'Excel (.xlsx)',
      description: 'Professional spreadsheet format with multiple sheets',
      benefits: ['Easy to read and study', 'Organized by subject', 'Works with Excel/Google Sheets', 'Formulas and filtering'],
      recommended: true
    },
    {
      format: 'CSV',
      description: 'Simple comma-separated format for data analysis',
      benefits: ['Universal compatibility', 'Smaller file size', 'Easy to import', 'Good for analysis'],
      recommended: false
    },
    {
      format: 'JSON',
      description: 'Structured data format for developers',
      benefits: ['Machine-readable', 'Preserves structure', 'Good for automation', 'API-friendly'],
      recommended: false
    }
  ];

  const layoutOptions = [
    {
      layout: 'By Subject',
      description: 'One sheet per subject (Air Law, Meteorology, etc.)',
      pros: ['Easy to navigate', 'Subject-focused study', 'Manageable file sizes'],
      recommended: true
    },
    {
      layout: 'By Subsection',
      description: 'Detailed breakdown with sheets for each topic',
      pros: ['Very detailed organization', 'Topic-specific study', 'Granular control'],
      recommended: false
    },
    {
      layout: 'Single Sheet',
      description: 'All questions in one large sheet',
      pros: ['Simple structure', 'Easy searching', 'Single file to manage'],
      recommended: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BookOpen className="h-6 w-6 mr-3" />
            ATPL Questions Extraction Guide
          </CardTitle>
          <CardDescription>
            Complete step-by-step guide for extracting and organizing aviation theory questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="database-options">Database Options</TabsTrigger>
              <TabsTrigger value="output-formats">Output Formats</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Welcome!</strong> This guide will walk you through extracting aviation questions 
                    from atplquestions.com using our user-friendly interface. No technical skills required!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Instructions</h3>
                  {gettingStartedSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">{step.step}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <step.icon className="h-5 w-5 text-blue-500" />
                                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {step.time}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                              <p className="text-xs text-gray-500">{step.details}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>First Time?</strong> Start with a small test extraction (1-2 subjects) to familiarize 
                    yourself with the process before extracting all subjects.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="database-options" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-purple-200 bg-purple-50">
                  <Database className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>Database Selection:</strong> Choose the right database for your needs. 
                    You can change this in the Settings tab.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {databaseOptions.map((option, index) => (
                    <Card key={index} className={option.recommended ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              {option.name}
                              {option.recommended && (
                                <Badge className="ml-2 bg-green-600">Recommended</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {option.estimatedSize}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {option.features.map((feature, i) => (
                            <div key={i} className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <HelpCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Need Help Choosing?</strong> For exam preparation, use <strong>EASA 2020</strong>. 
                    For comprehensive research or archival purposes, use <strong>EASA 2020 All Questions</strong>.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="output-formats" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-orange-200 bg-orange-50">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Output Configuration:</strong> Customize how your extracted questions are formatted and organized. 
                    Configure these options in the Settings tab.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {/* File Formats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">File Formats</h3>
                    <div className="space-y-3">
                      {outputFormats.map((format, index) => (
                        <Card key={index} className={format.recommended ? 'border-green-200 bg-green-50' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                {format.format}
                                {format.recommended && (
                                  <Badge className="ml-2 bg-green-600">Recommended</Badge>
                                )}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{format.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {format.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center space-x-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  <span className="text-xs text-gray-600">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Layout Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Spreadsheet Layouts</h3>
                    <div className="space-y-3">
                      {layoutOptions.map((option, index) => (
                        <Card key={index} className={option.recommended ? 'border-green-200 bg-green-50' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                {option.layout}
                                {option.recommended && (
                                  <Badge className="ml-2 bg-green-600">Recommended</Badge>
                                )}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {option.pros.map((pro, i) => (
                                <div key={i} className="flex items-center space-x-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  <span className="text-xs text-gray-600">{pro}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Content Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What Content to Include</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700">Recommended Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">✅ Include Explanations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">✅ Include Comments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">✅ Include Media Files</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">✅ Original Quality Media</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-700">Quick Extraction</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">✅ Include Explanations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="h-4 w-4"></span>
                            <span className="text-sm text-gray-400">❌ Skip Comments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="h-4 w-4"></span>
                            <span className="text-sm text-gray-400">❌ Skip Media Files</span>
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
                            <Zap className="h-3 w-3 inline mr-1" />
                            Faster extraction, smaller files
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Common Issues:</strong> Solutions for the most frequent problems users encounter.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-700">Login Problems</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">❌ "Invalid credentials" error</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Solution:</strong> Double-check your username and password. Try logging into atplquestions.com 
                          manually first to verify your credentials work.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">❌ "Connection timeout" error</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Solution:</strong> Check your internet connection. The atplquestions.com website might be 
                          temporarily unavailable - try again in a few minutes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-700">Extraction Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">⚠️ Extraction stops or freezes</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Solution:</strong> Use the pause button, check your internet connection, then resume. 
                          If it continues, try increasing the timeout in Settings.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">⚠️ Many questions are failing</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Solution:</strong> Check the Errors tab for details. Usually caused by network issues or 
                          rate limiting. Increase request delay in Settings and use the retry feature.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-700">Performance Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-2">
                          <Zap className="h-4 w-4 text-yellow-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sm">For Speed</h4>
                            <p className="text-xs text-gray-600">Skip media files, use 500ms delay</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sm">For Reliability</h4>
                            <p className="text-xs text-gray-600">Use 1000ms delay, 3 retries, 30s timeout</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-purple-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sm">For Complete Data</h4>
                            <p className="text-xs text-gray-600">Include all content, original media quality</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Getting Help</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Check the <strong>Errors tab</strong> for detailed failure reports</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Adjust settings for better performance and reliability</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>Test with small extractions before running large jobs</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start Card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">Ready to Extract Questions?</h3>
              <p className="text-sm text-green-700">
                Start with the Login tab to enter your ATPL Questions credentials and begin extraction.
              </p>
            </div>
            <div className="space-x-2">
              <Badge className="bg-green-600">No Setup Required</Badge>
              <Badge variant="outline">Works in Any Browser</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
