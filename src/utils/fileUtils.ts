/**
 * Convert a file to base64 string
 * @param file The file to convert
 * @returns Promise with the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Check if a file is a PDF
 * @param file The file to check
 * @returns Boolean indicating if the file is a PDF
 */
export const isPdf = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Get the file size in a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const getReadableFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}; 