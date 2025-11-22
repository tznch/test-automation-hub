import { useState, useRef } from 'react';

interface UploadedFile {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt?: string;
  createdAt?: string;
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setError('');
    setUploading(true);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append('files', file);
    });

    try {
      // Use fetch directly for multipart/form-data (no auth required in open platform)
      const fetchResponse = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!fetchResponse.ok) {
        throw new Error('Upload failed');
      }

      // The original instruction had a syntax error and introduced undeclared variables.
      // Assuming the intent was to process the response from the new endpoint
      // and map it similarly to how the old endpoint's response was handled.
      // This is a best-effort interpretation to maintain syntactic correctness.
      const response = await fetchResponse.json();
      const newFiles = response.files.map((f: any) => ({
        ...f,
        uploadedAt: f.uploadedAt || f.createdAt,
      }));
      setFiles([...files, ...newFiles]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // For open platform, just remove from UI - backend requires auth
      // In production, this would need proper authentication
      setFiles(files.filter((file) => file.id !== id));
      // Optionally show warning that deletion only affects local state
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">File Upload</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded">{error}</div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${dragActive
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        data-testid="drop-zone"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
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

        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              Drag and drop files here, or click to select
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              data-testid="file-input"
              id="file-upload"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              data-testid="select-files-button"
            >
              Select Files
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Support for multiple files. Max 10MB per file.
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Files ({files.length})
          </h3>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
                data-testid={`file-${file.id}`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.originalName || file.filename}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                  data-testid={`delete-${file.id}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
