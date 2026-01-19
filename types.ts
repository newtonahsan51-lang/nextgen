
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: string;
}

export interface ConvertedFile {
  originalPath: string;
  nextPath: string;
  content: string;
  explanation: string;
}

export interface ConversionStatus {
  isConverting: boolean;
  progress: number;
  message: string;
  error?: string;
}

export interface UserFeedback {
  experience: 'great' | 'okay' | 'poor';
  comments: string;
  timestamp: string;
}
