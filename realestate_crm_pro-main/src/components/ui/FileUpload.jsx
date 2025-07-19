import React, { useState, useRef } from 'react';

const FileUpload = ({
  onFilesSelected,
  multiple = false,
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}`);
    }

    // Check file type if accept is specified and not wildcard
    if (accept !== '*' && !accept.includes(file.type) && !accept.includes(file.name.split('.').pop())) {
      errors.push(`File "${file.name}" type is not allowed`);
    }

    return errors;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const allErrors = [];

    // Check max files limit
    if (!multiple && fileArray.length > 1) {
      allErrors.push('Only one file is allowed');
      setErrors(allErrors);
      return;
    }

    if (multiple && fileArray.length > maxFiles) {
      allErrors.push(`Maximum ${maxFiles} files allowed`);
      setErrors(allErrors);
      return;
    }

    // Validate each file
    const validFiles = [];
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0
        });
      } else {
        allErrors.push(...fileErrors);
      }
    });

    setErrors(allErrors);

    if (validFiles.length > 0) {
      setUploadedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
      
      // TODO: Implement actual file upload logic in future PRs
      // For now, just simulate upload progress
      validFiles.forEach(fileObj => {
        simulateUpload(fileObj);
      });

      if (onFilesSelected) {
        onFilesSelected(validFiles.map(f => f.file));
      }
    }
  };

  const simulateUpload = (fileObj) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id ? { ...f, progress } : f
        )
      );
    }, 200);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!disabled) {
      const files = e.dataTransfer.files;
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const defaultContent = (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
            Click to upload
          </span>
          {' '}or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {accept !== '*' && `Supported formats: ${accept}`}
          {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          {multiple && ` • Max files: ${maxFiles}`}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {children || defaultContent}
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{fileObj.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(fileObj.size)}</p>
                {fileObj.progress < 100 && (
                  <div className="mt-1">
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${fileObj.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(fileObj.progress)}%</p>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fileObj.id);
                }}
                className="text-gray-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;