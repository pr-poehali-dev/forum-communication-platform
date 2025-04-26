
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileIcon, ImageIcon, VideoIcon, FileTextIcon } from "lucide-react";

type FileUploadProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export const FileUpload = ({
  files,
  setFiles,
  maxFiles = 5,
  maxSizeMB = 10,
  allowedTypes,
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Максимальное количество файлов: ${maxFiles}`);
      return;
    }
    
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      setError(`Максимальный размер файла: ${maxSizeMB}MB`);
      return;
    }
    
    if (allowedTypes) {
      const invalidFiles = selectedFiles.filter(
        (file) => !allowedTypes.includes(file.type)
      );
      
      if (invalidFiles.length > 0) {
        setError(`Допустимые типы файлов: ${allowedTypes.join(", ")}`);
        return;
      }
    }
    
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setError(null);
    e.target.value = ""; // Clear input
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <VideoIcon className="h-5 w-5 text-red-500" />;
    } else if (file.type.startsWith("text/")) {
      return <FileTextIcon className="h-5 w-5 text-yellow-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 border rounded-md bg-gray-50"
          >
            {getFileIcon(file)}
            <span className="text-sm truncate max-w-[150px]">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileIcon className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-medium">Нажмите для загрузки</span> или перетащите файлы сюда
            </p>
            <p className="text-xs text-gray-500">
              До {maxFiles} файлов (макс. {maxSizeMB}MB каждый)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};
