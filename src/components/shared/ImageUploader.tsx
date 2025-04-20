import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ImageUploader({ onUpload }: { onUpload: (urls: string[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const urls = fileArray.map(file => URL.createObjectURL(file));
    onUpload(urls);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <motion.div
        initial={{ borderColor: 'rgba(75, 85, 99, 0.5)' }}
        animate={{ borderColor: isDragging ? 'rgba(59, 130, 246, 0.8)' : 'rgba(75, 85, 99, 0.5)' }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragging ? 'bg-blue-500/10' : 'bg-gray-700/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-300">Drag & drop chart screenshots or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          title="Upload image(s)"
          placeholder="Upload image(s)"
        />
      </motion.div>
    </div>
  );
}
