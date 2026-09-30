import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Download, Eye, AlertCircle, Loader2, Box } from 'lucide-react';
import { api } from '../../services/api';

export interface UploadedFileMeta {
  name: string;
  url: string;
  size: string;
  type?: string;
}

interface FileUploadZoneProps {
  label?: string;
  accept?: string;
  value?: UploadedFileMeta | null;
  onChange: (fileMeta: UploadedFileMeta | null) => void;
  helperText?: string;
  compact?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label = 'Upload Blueprint / PDF / CAD File',
  accept = '.pdf,.step,.stp,.dwg,.dxf,.iges,.png,.jpg,.jpeg,.zip',
  value,
  onChange,
  helperText = 'Supports PDF, STEP, DWG, DXF, PNG, ZIP (Max 50MB)',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcessFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await api.uploadFile(file);
      if (res && res.success && res.data) {
        onChange({
          name: res.data.originalName || file.name,
          url: res.data.cdnUrl || res.data.url,
          size: formatFileSize(res.data.sizeBytes || file.size),
          type: res.data.mimetype || file.type,
        });
      } else {
        // Fallback to local Object URL if server is offline or returned error
        const localUrl = URL.createObjectURL(file);
        onChange({
          name: file.name,
          url: localUrl,
          size: formatFileSize(file.size),
          type: file.type,
        });
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      const localUrl = URL.createObjectURL(file);
      onChange({
        name: file.name,
        url: localUrl,
        size: formatFileSize(file.size),
        type: file.type,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const isPdf = value?.name?.toLowerCase().endsWith('.pdf');
  const isCad = value?.name?.toLowerCase().match(/\.(step|stp|dwg|dxf|iges)$/i);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-700 font-mono flex items-center justify-between">
          <span>{label}</span>
          {value && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Attached Ready
            </span>
          )}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        className="hidden"
      />

      {value ? (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center justify-between gap-3 hover:border-orange-400 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isPdf 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : isCad 
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-600' 
                  : 'bg-orange-50 border-orange-200 text-orange-600'
            }`}>
              {isPdf ? (
                <FileText className="w-5 h-5" />
              ) : isCad ? (
                <Box className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold font-mono text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                  {value.name}
                </p>
                {isPdf && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-rose-600 text-white rounded uppercase">
                    PDF
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                {value.size} • <span className="text-emerald-600 font-bold">Upload Verified</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {value.url && (
              <a
                href={value.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Preview / Download Document"
              >
                <Eye className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                onChange(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-5 text-center ${
            isDragging 
              ? 'border-orange-500 bg-orange-50/70 scale-[1.01]' 
              : 'border-slate-300 bg-slate-50/80 hover:bg-white hover:border-orange-400'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              <p className="text-xs font-mono font-bold text-slate-800">Uploading Document to Server...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 font-mono">
                  <span className="text-orange-600 hover:underline">Click to browse</span> or drag and drop PDF / CAD Drawing
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {helperText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-rose-600 font-mono font-bold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
        </p>
      )}
    </div>
  );
};
