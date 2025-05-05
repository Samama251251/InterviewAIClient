import { useState, useRef } from 'react';
import { X, Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { processCandidateCSV } from '@/services/bulkCandidateUpload';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onSuccess: (result: { successful: number; failed: number; total: number }) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  jobId,
  onSuccess
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };
  
  const isValidFileType = (file: File) => {
    return file.type === 'text/csv' || file.name.endsWith('.csv');
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await processCandidateCSV(selectedFile, jobId);
      
      onSuccess({
        successful: result.successful.length,
        failed: result.failed.length,
        total: result.total
      });
      
      toast.success(`Successfully added ${result.successful.length} candidates`);
      
      if (result.failed.length > 0) {
        toast.error(`Failed to add ${result.failed.length} candidates`);
      }
      
      // Close the modal on success
      onClose();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process candidate file');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Bulk Upload Candidates</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-base-content/80">
            Upload a CSV file containing candidate emails. Only candidates with valid registered emails will be added.
          </p>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-base-300'
            } cursor-pointer transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            
            <FileUp className="h-10 w-10 mx-auto text-base-content/60 mb-2" />
            
            {selectedFile ? (
              <div className="space-y-1">
                <p className="font-medium flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  File selected
                </p>
                <p className="text-sm text-base-content/70">{selectedFile.name}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">Drag & drop a CSV file here</p>
                <p className="text-sm text-base-content/70">or click to browse</p>
              </div>
            )}
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-info mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">CSV File Format</p>
                <p className="text-xs text-base-content/70">
                  Your CSV file should include an "email" column. Only candidates with valid registered email addresses will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-action mt-6">
          <button 
            type="button" 
            className="btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Candidates
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default BulkUploadModal; 