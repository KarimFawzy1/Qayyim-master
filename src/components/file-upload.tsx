"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileText, X, File as FileIcon, FileType } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) {
    return <FileType className="h-6 w-6 text-red-500" />;
  }
  if (fileName.endsWith('.docx')) {
    return <FileIcon className="h-6 w-6 text-blue-500" />;
  }
  return <FileText className="h-6 w-6 text-gray-500" />;
};

type FileUploadProps = {
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;  // NEW: Callback to expose files to parent
  value?: File[];  // NEW: Controlled value
};

export function FileUpload({ maxFiles = 2, onFilesChange, value }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value || []);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setFiles(value);
    }
  }, [value]);

  const updateFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  }, [onFilesChange]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const currentFileNames = new Set(files.map(f => f.name));
    const uniqueNewFiles = acceptedFiles.filter(file => !currentFileNames.has(file.name));
    
    const duplicates: FileRejection[] = acceptedFiles
        .filter(file => currentFileNames.has(file.name))
        .map(file => ({ file, errors: [{ code: 'duplicate-file', message: 'File with this name already added.' }] }));

    const combinedFiles = [...files, ...uniqueNewFiles];
    
    let newFilesToAdd = combinedFiles;
    let excessFiles: FileRejection[] = [];

    if (maxFiles && combinedFiles.length > maxFiles) {
      newFilesToAdd = combinedFiles.slice(0, maxFiles);
      excessFiles = combinedFiles.slice(maxFiles).map(file => ({ file, errors: [{ code: 'too-many-files', message: `You can only upload a maximum of ${maxFiles} files.`}]}));
    }
    
    updateFiles(newFilesToAdd);
    setRejectedFiles([...fileRejections, ...duplicates, ...excessFiles]);
  }, [files, maxFiles, updateFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    onDropRejected: (fileRejections) => {
      setRejectedFiles(prev => [...prev, ...fileRejections]);
    },
  });

  const removeFile = (fileName: string) => {
    const newFiles = files.filter(file => file.name !== fileName);
    updateFiles(newFiles);
  };

  const clearAllFiles = () => {
    updateFiles([]);
    setRejectedFiles([]);
  }
  
  const removeRejectedFile = (fileName: string) => {
    setRejectedFiles(rejectedFiles.filter(({ file }) => file.name !== fileName));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed",
          isDragActive ? "border-primary bg-primary/10" : "hover:border-primary"
        )}
      >
        <Input {...getInputProps()} />
        <div className="text-center">
          <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the files here ..." : "Drag & drop files here, or click to browse."}
          </p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max {maxFiles} files)</p>
        </div>
      </div>

      {(files.length > 0 || rejectedFiles.length > 0) && (
        <div className="mt-4 space-y-4">
            {files.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Selected Files ({files.length})</h3>
                  <Button variant="link" size="sm" className="h-auto p-0" onClick={clearAllFiles}>
                    Clear all
                  </Button>
                </div>
                <ScrollArea className="h-48 rounded-md border p-2">
                  <div className="space-y-2">
                    {files.map(file => (
                        <div key={file.name} className="flex items-center justify-between rounded-md border bg-muted/50 p-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                                {getFileIcon(file.name)}
                                <span className="truncate text-sm font-medium">{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeFile(file.name)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
             {rejectedFiles.length > 0 && (
                <div>
                <h3 className="font-medium text-destructive">Rejected Files:</h3>
                <div className='mt-2 space-y-2'>
                  {rejectedFiles.map(({ file, errors }, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border border-destructive bg-destructive/10 p-2">
                          <div className='flex items-center gap-2 overflow-hidden'>
                              {getFileIcon(file.name)}
                              <div>
                                  <p className="truncate text-sm font-medium text-destructive">{file.name}</p>
                                  {errors.map(e => (
                                      <p key={e.code} className="text-xs text-destructive"> - {e.message}</p>
                                  ))}
                              </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-destructive hover:text-destructive" onClick={() => removeRejectedFile(file.name)}>
                              <X className="h-4 w-4" />
                          </Button>
                      </div>
                  ))}
                </div>
                </div>
             )}
        </div>
      )}
    </div>
  );
}