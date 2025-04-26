import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileVideo, Upload, File } from "lucide-react";

type MessageFile = {
  name: string;
  url: string;
  type: "image" | "video" | "file";
};

interface FileUploadProps {
  onUpload: (files: MessageFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    const uploadedFiles: MessageFile[] = [];
    
    Array.from(files).forEach((file) => {
      // В реальном приложении здесь был бы запрос на сервер для загрузки файла
      // Здесь мы просто создаем локальный URL для демонстрации
      const fileUrl = URL.createObjectURL(file);
      
      let fileType: "image" | "video" | "file" = "file";
      
      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type.startsWith("video/")) {
        fileType = "video";
      }
      
      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        type: fileType,
      });
    });
    
    // Имитируем задержку загрузки
    setTimeout(() => {
      onUpload(uploadedFiles);
      setIsLoading(false);
      // Сбрасываем value, чтобы можно было загрузить тот же файл повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 500);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,video/*,application/*"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={triggerFileInput}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
          <span>{isLoading ? "Загрузка..." : "Прикрепить файл"}</span>
        </Button>
        
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="ghost"
            size="icon"
            className="text-primary"
            disabled={isLoading}
            title="Изображение"
          >
            <FileImage className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="ghost"
            size="icon"
            className="text-primary"
            disabled={isLoading}
            title="Видео"
          >
            <FileVideo className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="ghost"
            size="icon"
            className="text-primary"
            disabled={isLoading}
            title="Другой файл"
          >
            <File className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading && (
          <div className="ml-2 text-sm text-muted-foreground animate-pulse">
            Загрузка файлов...
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
