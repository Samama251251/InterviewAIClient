// CV upload request
export interface CVUploadRequest {
  interviewId: string;
  cvBase64: string;
}

// CV response from the server
export interface CVResponse {
  interviewId: string;
  cvUrl: string;
  parsedCv: string | null;
}