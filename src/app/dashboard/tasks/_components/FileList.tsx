"use client";

import { useState, useEffect, useRef } from "react";
import { File as FileType } from "@/shared/types/file";
import { ConfirmModal } from "@/core/ui/Modal";

interface FileListProps {
  files: FileType[];
  onDelete?: (fileId: string) => Promise<void>;
}

export function FileList({ files, onDelete }: FileListProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDeleteClick = (file: FileType) => {
    setFileToDelete(file);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete || !fileToDelete) return;

    const fileId = fileToDelete.id;
    setDeletingFileId(fileId);

    try {
      await onDelete(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      if (isMountedRef.current) {
        setDeletingFileId(null);
        setFileToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setFileToDelete(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleDownload = (file: FileType) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = file.filepath;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">Nenhum arquivo anexado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">
        Arquivos anexados ({files.length})
      </p>
      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <svg
                className="w-5 h-5 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {file.filename}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)} • {file.mimetype}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <button
                type="button"
                onClick={() => handleDownload(file)}
                className="text-blue-600 hover:text-blue-800 p-1"
                aria-label="Baixar arquivo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(file)}
                  disabled={deletingFileId === file.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                  aria-label="Remover arquivo"
                >
                  {deletingFileId === file.id ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={!!fileToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Remover arquivo"
        message={`Tem certeza que deseja remover o arquivo "${fileToDelete?.filename}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deletingFileId === fileToDelete?.id}
      />
    </div>
  );
}
