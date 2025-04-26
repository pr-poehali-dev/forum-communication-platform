import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, Send } from "lucide-react";
import Logo from "@/components/ui/logo";
import FileUpload from "@/components/FileUpload";

// Моковые данные для тем
const topicsData = {
  "1": {
    id: "1",
    title: "Приветственная тема",
    categoryId: "general",
    categoryName: "Общее обсуждение", 
  },
  "2": {
    id: "2",
    title: "Последние новости",
    categoryId: "general",
    categoryName: "Общее обсуждение",
  },
  "3": {
    id: "3",
    title: "Новые телефоны 2025",
    categoryId: "technology",
    categoryName: "Технологии",
  },
  "4": {
    id: "4",
    title: "Язык программирования Rust",
    categoryId: "technology",
    categoryName: "Технологии",
  },
  "5": {
    id: "5",
    title: "Лучшие фильмы 2025",
    categoryId: "entertainment",
    categoryName: "Развлечения",
  },
  "6": {
    id: "6",
    title: "Новые игры на ПК",
    categoryId: "entertainment",
    categoryName: "Развлечения",
  },
};

// Моковые данные для сообщений
const initialMessages = {
  "1": [
    {
      id: "m1",
      author: "Аноним",
      content: "Привет всем! Рад приветствовать вас на форуме. Давайте знакомиться!",
      timestamp: "2025-04-24T10:30:00",
      files: [],
    },
    {
      id: "m2",
      author: "Аноним",
      content: "Привет! Отличный форум, мне нравится дизайн!",
      timestamp: "2025-04-24T11:15:00",
      files: [],
    },
    {
      id: "m3",
      author: "Аноним",
      content: "И мне тоже. Особенно то, что не нужно регистрироваться.",
      timestamp: "2025-04-24T12:45:00",
      files: [
        {
          name: "example.jpg",
          url: "https://picsum.photos/800/600",
          type: "image"
        }
      ],
    },
  ],
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const generateRandomColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 35%)`;
};

// Тип файла сообщения
type MessageFile = {
  name: string;
  url: string;
  type: "image" | "video" | "file";
};

// Тип сообщения
type Message = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  files: MessageFile[];
};

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [messages, setMessages] = useState<Message[]>(
    initialMessages[topicId as keyof typeof initialMessages] || []
  );
  const [newMessage, setNewMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<MessageFile[]>([]);
  const [nickname, setNickname] = useState("Аноним");
  
  const topic = topicId ? topicsData[topicId as keyof typeof topicsData] : null;

  const handleFileUpload = (files: MessageFile[]) => {
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && uploadedFiles.length === 0) return;

    const newMessageObj: Message = {
      id: `m${Date.now()}`,
      author: nickname,
      content: newMessage,
      timestamp: new Date().toISOString(),
      files: uploadedFiles,
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage("");
    setUploadedFiles([]);
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Тема не найдена</h1>
          <Button as={Link} to="/" variant="outline">
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-secondary text-secondary-foreground py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link to="/">
              <Logo size={48} className="mb-2" />
            </Link>
            <div className="ml-4">
              <p className="text-lg opacity-90">Общайтесь свободно, без регистрации</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Link to={`/category/${topic.categoryId}`} className="text-primary hover:underline mb-2 inline-block">
            ← Назад к категории {topic.categoryName}
          </Link>
          <h1 className="text-2xl font-bold text-primary">{topic.title}</h1>
        </div>

        <div className="space-y-6 mb-8">
          {messages.map((message) => (
            <Card key={message.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-10 w-10" style={{ backgroundColor: generateRandomColor(message.author) }}>
                  <AvatarFallback>{message.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-semibold">{message.author}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDate(message.timestamp)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {message.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.files.map((file, index) => (
                      <div key={index}>
                        {file.type === "image" && (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="max-h-96 max-w-full rounded-md object-contain"
                          />
                        )}
                        {file.type === "video" && (
                          <video 
                            src={file.url}
                            controls
                            className="max-h-96 max-w-full rounded-md"
                          />
                        )}
                        {file.type === "file" && (
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-muted rounded-md hover:bg-muted/70 transition-colors"
                          >
                            <span className="ml-2">{file.name}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {messages.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">В этой теме пока нет сообщений. Будьте первым!</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value || "Аноним")}
                placeholder="Аноним"
                className="bg-transparent border-none text-sm focus:outline-none focus:ring-0 p-1 border-b border-border"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Напишите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[120px] resize-y bg-muted focus:ring-primary"
              autoFocus
            />
            <div className="mt-4">
              <FileUpload onUpload={handleFileUpload} />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Прикрепленные файлы:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                      <span className="ml-2 truncate flex-1">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFile(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button 
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 flex items-center gap-1"
              disabled={newMessage.trim() === "" && uploadedFiles.length === 0}
            >
              <Send className="h-4 w-4" />
              <span>Отправить</span>
            </Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-secondary py-6 mt-auto border-t border-border">
        <div className="container mx-auto px-4 text-center text-secondary-foreground">
          <div className="flex items-center justify-center mb-2">
            <Logo size={32} />
          </div>
          <p>© 2025 2Hacker - Общение без регистрации</p>
        </div>
      </footer>
    </div>
  );
};

export default TopicPage;
