import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, Send, Users, MessageSquare, Trash2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import FileUpload from "@/components/FileUpload";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Получение категорий
const categoryData = {
  general: {
    id: "general",
    name: "Взломы сайтов",
    description: "Обсуждение техник проникновения и защиты веб-ресурсов",
  },
  technology: {
    id: "technology",
    name: "Вирусописательство",
    description: "Разработка вредоносного ПО и способы защиты от него",
  },
  entertainment: {
    id: "entertainment",
    name: "СМС бомбинг",
    description: "Обсуждение методов рассылки СМС и защита от спама",
  },
};

// Функции для работы с localStorage
const getStoredTopics = () => {
  try {
    const storedTopics = localStorage.getItem('2hacker_topics');
    return storedTopics ? JSON.parse(storedTopics) : {};
  } catch (e) {
    console.error('Ошибка при получении тем из хранилища:', e);
    return {};
  }
};

const saveTopics = (topics) => {
  try {
    localStorage.setItem('2hacker_topics', JSON.stringify(topics));
  } catch (e) {
    console.error('Ошибка при сохранении тем в хранилище:', e);
  }
};

const getStoredMessages = () => {
  try {
    const storedMessages = localStorage.getItem('2hacker_messages');
    return storedMessages ? JSON.parse(storedMessages) : {};
  } catch (e) {
    console.error('Ошибка при получении сообщений из хранилища:', e);
    return {};
  }
};

const saveMessages = (messages) => {
  try {
    localStorage.setItem('2hacker_messages', JSON.stringify(messages));
  } catch (e) {
    console.error('Ошибка при сохранении сообщений в хранилище:', e);
  }
};

// Система отслеживания посетителей темы
const addViewToTopic = (topicId, categoryId) => {
  try {
    const now = new Date().toISOString();
    const stats = JSON.parse(localStorage.getItem('2hacker_stats') || '{}');
    
    if (!stats.topics) {
      stats.topics = {};
    }
    
    if (!stats.topics[topicId]) {
      stats.topics[topicId] = { views: 0, visitors: [], lastVisit: now, categoryId };
    }
    
    // Добавляем просмотр
    stats.topics[topicId].views += 1;
    
    // Генерируем уникальный ID для посетителя если его нет
    const visitorId = localStorage.getItem('2hacker_visitor_id') || 
      `visitor_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('2hacker_visitor_id', visitorId);
    
    // Добавляем посетителя если его нет в списке
    if (!stats.topics[topicId].visitors.includes(visitorId)) {
      stats.topics[topicId].visitors.push(visitorId);
    }
    
    stats.topics[topicId].lastVisit = now;
    
    localStorage.setItem('2hacker_stats', JSON.stringify(stats));
    return {
      viewCount: stats.topics[topicId].views,
      visitorCount: stats.topics[topicId].visitors.length
    };
  } catch (e) {
    console.error('Ошибка при обновлении статистики темы:', e);
    return { viewCount: 0, visitorCount: 0 };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const generateRandomColor = (name) => {
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
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [topic, setTopic] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<MessageFile[]>([]);
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem('2hacker_nickname') || "Аноним";
  });
  const [stats, setStats] = useState({ viewCount: 0, visitorCount: 0 });
  const [allTopics, setAllTopics] = useState(getStoredTopics());
  const [allMessages, setAllMessages] = useState(getStoredMessages());
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  
  // Определяем владельца темы
  const visitorId = localStorage.getItem('2hacker_visitor_id');
  const isTopicOwner = topic && topic.visitorId === visitorId;
  
  useEffect(() => {
    if (topicId) {
      // Находим тему в localStorage
      const topics = getStoredTopics();
      let foundTopic = null;
      let categoryId = null;
      
      // Сначала проверяем формат ID темы (если это новый формат с ID категории)
      if (topicId.includes('_')) {
        categoryId = topicId.split('_')[0];
        if (topics[categoryId]) {
          foundTopic = topics[categoryId].find(t => t.id === topicId);
        }
      } else {
        // Если старый формат, ищем во всех категориях
        for (const catId in topics) {
          const found = topics[catId].find(t => t.id === topicId);
          if (found) {
            foundTopic = found;
            categoryId = catId;
            break;
          }
        }
      }
      
      if (foundTopic) {
        setTopic({
          ...foundTopic,
          categoryId,
          categoryName: categoryData[categoryId]?.name || "Категория"
        });
        
        // Получаем сообщения из localStorage
        const storedMessages = getStoredMessages();
        setMessages(storedMessages[topicId] || []);
        
        // Обновляем статистику
        const currentStats = addViewToTopic(topicId, categoryId);
        setStats(currentStats);
      } else {
        // Тема не найдена
        navigate('/');
      }
    }
  }, [topicId, navigate]);
  
  // Сохраняем никнейм при изменении
  useEffect(() => {
    localStorage.setItem('2hacker_nickname', nickname);
  }, [nickname]);
  
  // Прокручиваем к последнему сообщению при добавлении нового
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

    const now = new Date().toISOString();
    const newMessageObj: Message = {
      id: `m${Date.now()}`,
      author: nickname,
      content: newMessage,
      timestamp: now,
      files: uploadedFiles,
    };

    // Сохраняем сообщение в localStorage
    const updatedMessages = [...messages, newMessageObj];
    const allUpdatedMessages = { ...allMessages, [topicId]: updatedMessages };
    setMessages(updatedMessages);
    setAllMessages(allUpdatedMessages);
    saveMessages(allUpdatedMessages);
    
    // Обновляем информацию о теме (количество сообщений и последняя активность)
    if (topic && topic.categoryId) {
      const updatedTopics = { ...allTopics };
      const categoryTopics = updatedTopics[topic.categoryId];
      
      if (categoryTopics) {
        const topicIndex = categoryTopics.findIndex(t => t.id === topicId);
        if (topicIndex >= 0) {
          updatedTopics[topic.categoryId][topicIndex] = {
            ...updatedTopics[topic.categoryId][topicIndex],
            messageCount: updatedMessages.length,
            lastActive: now,
          };
          
          setAllTopics(updatedTopics);
          saveTopics(updatedTopics);
        }
      }
    }

    setNewMessage("");
    setUploadedFiles([]);
  };
  
  const handleDeleteTopic = () => {
    if (!topic || !topic.categoryId) return;
    
    // Удаляем тему
    const updatedTopics = { ...allTopics };
    updatedTopics[topic.categoryId] = updatedTopics[topic.categoryId].filter(t => t.id !== topicId);
    setAllTopics(updatedTopics);
    saveTopics(updatedTopics);
    
    // Удаляем сообщения
    const updatedMessages = { ...allMessages };
    delete updatedMessages[topicId];
    setAllMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    // Возвращаемся в категорию
    navigate(`/category/${topic.categoryId}`);
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
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
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-primary">{topic.title}</h1>
            {isTopicOwner && (
              <AlertDialog 
                open={deleteConfirmationOpen} 
                onOpenChange={setDeleteConfirmationOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Удалить тему</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие удалит тему и все сообщения в ней. Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteTopic}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Посетителей: {stats.visitorCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Просмотров: {stats.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Автор: {topic.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Создано: {formatDate(topic.createdAt || topic.lastActive)}</span>
            </div>
          </div>
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
          
          <div ref={messagesEndRef} />
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
