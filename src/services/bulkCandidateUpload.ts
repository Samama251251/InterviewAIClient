import Papa, { ParseResult } from 'papaparse';
import { getUserByEmail } from './getUserByEmail';
import api from './api';
import { InterviewResponse } from '@/types/interview';

interface UploadResult {
  successful: Array<{ email: string; name: string }>;
  failed: Array<{ email: string; reason: string }>;
  total: number;
}

/**
 * Process a CSV file and create interview entries for valid candidate emails
 */
export const processCandidateCSV = async (
  file: File,
  jobId: string
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<Record<string, string>>) => {
        try {
          const candidates = results.data;
          const result = await processCandidates(candidates, jobId);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(new Error(`Error parsing CSV file: ${error.message}`));
      }
    });
  });
};

/**
 * Process candidate data and create interviews concurrently
 */
const processCandidates = async (
  candidates: Array<Record<string, string>>,
  jobId: string
): Promise<UploadResult> => {
  const result: UploadResult = {
    successful: [],
    failed: [],
    total: candidates.length
  };

  // Get email field name - could be "email", "Email", etc.
  const emailField = findEmailField(candidates[0] || {});
  if (!emailField && candidates.length > 0) {
    throw new Error('No email field found in the CSV file');
  }

  // Create an array of promises for concurrent processing
  const processingPromises = candidates.map(async (candidate) => {
    const email = candidate[emailField || 'email']?.trim();

    if (!email) {
      return {
        success: false,
        email: 'N/A',
        reason: 'Missing email address'
      };
    }

    try {
      // Validate email format
      if (!isValidEmail(email)) {
        return {
          success: false,
          email,
          reason: 'Invalid email format'
        };
      }

      // Find user by email
      const user = await getUserByEmail(email);
      
      // Create interview
      await api.post<InterviewResponse>('/interviews', {
        job_id: jobId,
        user_id: user._id
      });

      return {
        success: true,
        email,
        name: user.name || email
      };
    } catch (error: any) {
      return {
        success: false,
        email,
        reason: error.message || 'Failed to create interview'
      };
    }
  });

  // Run all promises concurrently
  const results = await Promise.all(processingPromises);

  // Organize results
  results.forEach((res) => {
    if (res.success) {
      result.successful.push({ email: res.email, name: res.name as string });
    } else {
      result.failed.push({ email: res.email, reason: res.reason });
    }
  });

  return result;
};

/**
 * Find the email field name in the CSV header
 */
const findEmailField = (firstRow: Record<string, string>): string | null => {
  const possibleEmailFields = ['email', 'Email', 'EMAIL', 'email_address', 'Email Address'];
  
  for (const field of possibleEmailFields) {
    if (firstRow.hasOwnProperty(field)) {
      return field;
    }
  }
  
  // If none of the standard fields are found, look for any field containing "email"
  const fieldNames = Object.keys(firstRow);
  const emailField = fieldNames.find(field => 
    field.toLowerCase().includes('email')
  );
  
  return emailField || null;
};

/**
 * Basic email validation
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}; 