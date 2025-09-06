
export interface ATPLCredentials {
  username: string;
  password: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

export interface ExtractionJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  database: 'EASA 2020' | 'EASA 2020 All Questions';
  subjects: string; // Comma-separated string like "010,021,022"
  username: string;
  totalQuestions: number;
  extractedQuestions: number;
  failedQuestions: number;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractionLog {
  id: string;
  jobId: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
  timestamp: Date;
}

export interface FailedQuestion {
  id: string;
  jobId: string;
  questionId: string;
  subject: string;
  url?: string;
  error: string;
  retryCount: number;
  timestamp: Date;
}

export interface ExtractionResult {
  id: string;
  jobId: string;
  subject: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  questionCount: number;
  createdAt: Date;
}

export interface UserSettings {
  retryAttempts: number;
  delayBetweenRequests: number;
  timeoutDuration: number;
  enableMediaExtraction: boolean;
  outputFormat: 'json' | 'csv' | 'xml' | 'excel';
  database: 'EASA 2020' | 'EASA 2020 All Questions';
  spreadsheetLayout: 'single_sheet' | 'multiple_sheets' | 'by_subject' | 'by_subsection';
  includeExplanations: boolean;
  includeComments: boolean;
  includeMediaFiles: boolean;
  mediaDownloadFormat: 'original' | 'optimized' | 'both';
}

export const ATPL_SUBJECTS: SubjectInfo[] = [
  { id: '010', name: '010 - Air Law', description: 'Aviation regulations and legal requirements', questionCount: 1858 },
  { id: '021', name: '021 - Airframe, Systems, Electrics, Power Plant', description: 'Aircraft systems and components', questionCount: 2156 },
  { id: '022', name: '022 - Instrumentation', description: 'Aircraft instruments and displays', questionCount: 798 },
  { id: '031', name: '031 - Mass & Balance', description: 'Weight and balance calculations', questionCount: 456 },
  { id: '032', name: '032 - Performance', description: 'Aircraft performance calculations', questionCount: 892 },
  { id: '033', name: '033 - Flight Planning & Monitoring', description: 'Flight planning procedures and monitoring', questionCount: 1234 },
  { id: '040', name: '040 - Human Performance & Limitations', description: 'Human factors in aviation', questionCount: 567 },
  { id: '050', name: '050 - Meteorology', description: 'Weather and atmospheric conditions', questionCount: 1456 },
  { id: '061', name: '061 - General Navigation', description: 'Basic navigation principles', questionCount: 1123 },
  { id: '062', name: '062 - Radio Navigation', description: 'Radio navigation systems', questionCount: 934 },
  { id: '070', name: '070 - Operational Procedures', description: 'Flight operations and procedures', questionCount: 1789 },
  { id: '081', name: '081 - Principles of Flight', description: 'Aerodynamics and flight principles', questionCount: 1345 },
  { id: '090', name: '090 - Communications', description: 'Aviation communications and procedures', questionCount: 678 }
];
