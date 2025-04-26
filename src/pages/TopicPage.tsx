
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image, Paperclip, Send } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

// Мок-данные для темы
const topicData = {
  gen1: {
    title: "Приветственная тема",
    category: "general",
    messages: [
      {
        id: 1,
        author: "Гость1234",
        authorInitials: "Г",
        content: "Добро пожаловать на наш форум! Здесь мы обсуждаем разные темы и делимся интересными находками. Чувствуйте себя как дома!",
        timestamp: "26 апреля, 10:23",
        attachments: []
      },
      {
        id: 2,
        author: "Посетитель",
        authorInitials: "П",
        content: "Спасибо за приветствие! Рад присоединиться к сообществу.",
        timestamp: "26 апреля, 11:45",
        attachments: []
      },
      {
        id: 3,
        author: "НовыйГость",
        authorInitials: "Н",
        content: "И я тоже здесь! Отличная площадка для общения.",
        timestamp: "26 апреля, 14:22",
        attachments: [
          { name: "screenshot.jpg", url: "https://images.unsplash.com/photo-1698778574835-0945a90b8133?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", type: "image" }
        ]
      }
    ]
  },
  tech1: {
    title: "Новые технологии 2025",
    category: "technology",
    messages: [
      {
        id: 1,
        author: "Технарь",
        authorInitials: "Т",
        content: "Какие технологические новинки вы ждете в этом году? Я лично жду новые AR-очки и более доступные электрокары.",
        timestamp: "25 апреля, 15:30",
        attachments: []
      },
      {
        id: 2,
        author: "Гик2025",
        authorInitials: "Г",
        content: "А я жду развития нейроинтерфейсов! Технологии чтения мыслей уже не за горами.",
        timestamp: "25 апреля, 16:45",
        attachments: [
          { name: "neuralink.jpg", url: "https://images.unsplash.com/photo-1580584126903-c17d41830450?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", type: "image" }
        ]
      }
    ]
  }
};

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [messageText, setMessageText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  const topic = topicId && topicData[topicId as keyof typeof topicData];
  
  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Тема не найдена</h1>
        <Link to="/" className="text-primary hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь бы отправлялись данные на сервер
    if (messageText.trim()) {
      alert("Сообщение отправлено: " + messageText);
      setMessageText("");
      setFiles([]);
      setShowFileUpload(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link to={`/category/${topic.category}`} className="flex items-center gap-2 text-primary-foreground mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Назад к темам
          </Link>
          <h1 className="text-3xl font-bold">{topic.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          {topic.messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar>
                  <AvatarFallback>{message.authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{message.author}</h3>
                    <span className="text-sm text-gray-500">{message.timestamp}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{message.content}</p>
                
                {message.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index}>
                        {attachment.type === "image" ? (
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="max-w-full max-h-80 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded-md">
                            <Paperclip className="h-4 w-4" />
                            <span>{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Textarea
                  placeholder="Введите ваше сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[120px] resize-y"
                />
              </div>
              
              {showFileUpload && (
                <div className="mb-4">
                  <FileUpload 
                    files={files}
                    setFiles={setFiles}
                    maxFiles={5}
                    maxSizeMB={10}
                  />
                </div>
              )}

              <CardFooter className="flex justify-between px-0">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Файлы
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Изображения
                  </Button>
                </div>
                <Button type="submit" disabled={!messageText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Отправить
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 ОткрытыйФорум - Общение без регистрации</p>
        </div>
      </footer>
    </div>
  );
};

export default TopicPage;
