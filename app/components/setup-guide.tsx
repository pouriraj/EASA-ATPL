

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
  HelpCircle, 
  Download, 
  Play, 
  Settings, 
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Folder,
  FileText,
  Clock,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

export function SetupGuide() {
  const [activeGuideTab, setActiveGuideTab] = useState('overview');

  const systemRequirements = [
    { item: 'Web Browser', requirement: 'Chrome, Firefox, or Safari (latest version)' },
    { item: 'Internet Connection', requirement: 'Stable broadband connection (recommended)' },
    { item: 'Storage Space', requirement: 'At least 50GB free space (for full extraction)' },
    { item: 'RAM', requirement: '8GB or more (recommended for large extractions)' }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Login to ATPL Questions',
      description: 'Enter your atplquestions.com credentials in the Login tab',
      icon: Globe,
      time: '1 minute'
    },
    {
      step: 2,
      title: 'Select Subjects',
      description: 'Choose which aviation subjects you want to extract',
      icon: CheckCircle2,
      time: '2 minutes'
    },
    {
      step: 3,
      title: 'Configure Settings',
      description: 'Set database version and output format preferences',
      icon: Settings,
      time: '2 minutes'
    },
    {
      step: 4,
      title: 'Start Extraction',
      description: 'Create and run your extraction job',
      icon: Play,
      time: 'Varies by selection'
    }
  ];

  const troubleshootingTips = [
    {
      issue: 'Login fails or credentials rejected',
      solution: 'Verify your username and password. Try logging into atplquestions.com manually first.',
      severity: 'warning'
    },
    {
      issue: 'Extraction stops or freezes',
      solution: 'Check your internet connection. Use the pause/resume feature if needed.',
      severity: 'info'
    },
    {
      issue: 'Missing questions in results',
      solution: 'Check the Error tab for failed questions. Use the retry feature or manual recovery.',
      severity: 'warning'
    },
    {
      issue: 'Large file sizes or slow downloads',
      solution: 'Disable media extraction or use optimized media format in Settings.',
      severity: 'info'
    },
    {
      issue: 'Browser becomes unresponsive',
      solution: 'Reduce batch size in Settings. Close other browser tabs during extraction.',
      severity: 'error'
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
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            ATPL Questions Extraction Guide
          </CardTitle>
          <CardDescription>
            Complete setup and usage guide for extracting ATPL aviation questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeGuideTab} onValueChange={setActiveGuideTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Welcome!</strong> This tool extracts aviation theory questions from atplquestions.com 
                    into organized Excel spreadsheets with all explanations, comments, and media files.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* What You'll Get */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        What You'll Get
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Excel files organized by aviation subject</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Complete question text and answer choices</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Detailed explanations for each answer</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Community comments and discussions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Images, diagrams, and media files</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Error reports for manual review</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Monitor className="h-5 w-5 mr-2" />
                        System Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {systemRequirements.map((req, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="font-medium">{req.item}:</span>
                          <span className="text-gray-600">{req.requirement}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> This tool requires valid credentials for atplquestions.com. 
                    Ensure you have an active subscription before starting the extraction.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="quickstart" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Zap className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Quick Start:</strong> Follow these 4 simple steps to extract your first set of ATPL questions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {quickStartSteps.map((step, index) => (
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
                              <div className="flex items-center space-x-2 mb-1">
                                <step.icon className="h-4 w-4 text-blue-500" />
                                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {step.time}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>First Time Users:</strong> Start with a small test (1-2 subjects) to familiarize 
                    yourself with the process before extracting all subjects.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-purple-200 bg-purple-50">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>Advanced Configuration:</strong> Fine-tune your extraction process for optimal results.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Database Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Database Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-700">EASA 2020 (Recommended)</h4>
                        <p className="text-gray-600">Curated set of high-quality questions for each subject.</p>
                        <Badge variant="outline" className="mt-1">Faster extraction</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">EASA 2020 All Questions</h4>
                        <p className="text-gray-600">Complete database including all historical and practice questions.</p>
                        <Badge variant="outline" className="mt-1">Complete archive</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Output Formats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Output Formats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-700">Excel (.xlsx)</h4>
                        <p className="text-gray-600">Best for studying and organizing. Multiple sheets per subject.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">CSV</h4>
                        <p className="text-gray-600">Simple format for data analysis or import into other tools.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700">JSON</h4>
                        <p className="text-gray-600">Structured data format for developers or advanced processing.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spreadsheet Layouts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Spreadsheet Layouts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-700">By Subject (Recommended)</h4>
                        <p className="text-gray-600">One sheet per subject (Air Law, Meteorology, etc.)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">By Subsection</h4>
                        <p className="text-gray-600">Detailed breakdown with sheets for each topic</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-700">Single Sheet</h4>
                        <p className="text-gray-600">All questions in one sheet (not recommended for large extractions)</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">For Speed</h4>
                          <p className="text-gray-600">Disable media extraction, use 500ms request delay</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">For Reliability</h4>
                          <p className="text-gray-600">Use 1000ms delay, enable 3 retries, 30s timeout</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">For Complete Data</h4>
                          <p className="text-gray-600">Enable all content options, use original media format</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-0">
              <div className="space-y-6">
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Troubleshooting Guide:</strong> Solutions for common issues during extraction.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {troubleshootingTips.map((tip, index) => (
                    <Card key={index} className={
                      tip.severity === 'error' ? 'border-red-200 bg-red-50' :
                      tip.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={
                            tip.severity === 'error' ? 'text-red-600' :
                            tip.severity === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          }>
                            {tip.severity === 'error' ? <AlertTriangle className="h-5 w-5" /> :
                             tip.severity === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                             <HelpCircle className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{tip.issue}</h4>
                            <p className="text-sm text-gray-700">{tip.solution}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Getting Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Check Error Reports</h4>
                        <p className="text-sm text-gray-600">
                          Visit the "Errors" tab to see detailed failure reports with specific error messages.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Settings className="h-4 w-4 text-purple-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Adjust Settings</h4>
                        <p className="text-sm text-gray-600">
                          Most issues can be resolved by adjusting timeout, retry, or delay settings.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Monitor className="h-4 w-4 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Test First</h4>
                        <p className="text-sm text-gray-600">
                          Always test with 1-2 subjects before running a full extraction to identify potential issues.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Action Card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">Ready to Start?</h3>
              <p className="text-sm text-green-700">
                Begin with the Login tab to enter your ATPL Questions credentials.
              </p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.hash = '#login'}
            >
              <Play className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
