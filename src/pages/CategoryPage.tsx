import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User, Plus } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Моковые данные для категорий
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

// Локальное хранилище для тем
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

// Система статистики посетителей
const addViewToCategory = (categoryId) => {
  try {
    const now = new Date().toISOString();
    const stats = JSON.parse(localStorage.getItem('2hacker_stats') || '{}');
    
    if (!stats.categories) {
      stats.categories = {};
    }
    
    if (!stats.categories[categoryId]) {
      stats.categories[categoryId] = { views: 0, visitors: [], lastVisit: now };
    }
    
    // Добавляем просмотр
    stats.categories[categoryId].views += 1;
    
    // Генерируем уникальный ID для посетителя если его нет
    const visitorId = localStorage.getItem('2hacker_visitor_id') || 
      `visitor_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('2hacker_visitor_id', visitorId);
    
    // Добавляем посетителя если его нет в списке
    if (!stats.categories[categoryId].visitors.includes(visitorId)) {
      stats.categories[categoryId].visitors.push(visitorId);
    }
    
    stats.categories[categoryId].lastVisit = now;
    
    localStorage.setItem('2hacker_stats', JSON.stringify(stats));
    return {
      viewCount: stats.categories[categoryId].views,
      visitorCount: stats.categories[categoryId].visitors.length
    };
  } catch (e) {
    console.error('Ошибка при обновлении статистики:', e);
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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = categoryId ? categoryData[categoryId] : null;
  
  const [allTopics, setAllTopics] = useState(getStoredTopics());
  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [stats, setStats] = useState({ viewCount: 0, visitorCount: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Обновляем статистику при загрузке страницы
    if (categoryId) {
      const currentStats = addViewToCategory(categoryId);
      setStats(currentStats);
      
      // Получаем темы для текущей категории
      const storedTopics = getStoredTopics();
      if (storedTopics[categoryId]) {
        // Сортируем темы по дате последнего сообщения (от новых к старым)
        const sortedTopics = [...storedTopics[categoryId]].sort((a, b) => 
          new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        );
        setTopics(sortedTopics);
      } else {
        setTopics([]);
      }
    }
  }, [categoryId]);

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;
    
    const newTopic = {
      id: `${categoryId}_${Date.now()}`,
      title: newTopicTitle,
      description: newTopicDescription,
      author: localStorage.getItem('2hacker_nickname') || "Аноним",
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      messageCount: 0,
    };
    
    const updatedTopics = { ...allTopics };
    if (!updatedTopics[categoryId]) {
      updatedTopics[categoryId] = [];
    }
    
    updatedTopics[categoryId] = [newTopic, ...updatedTopics[categoryId]];
    
    setAllTopics(updatedTopics);
    setTopics(updatedTopics[categoryId]);
    saveTopics(updatedTopics);
    
    setNewTopicTitle("");
    setNewTopicDescription("");
    setIsDialogOpen(false);
    
    // Перенаправляем на страницу новой темы
    navigate(`/topic/${newTopic.id}`);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
          <Button as={Link} to="/" variant="outline">
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-primary hover:underline mb-2 inline-block">
            ← Назад к категориям
          </Link>
          <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
          <p className="text-muted-foreground mb-2">{category.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Посетителей: {stats.visitorCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Просмотров: {stats.viewCount}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Темы в этой категории</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Создать тему
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создание новой темы</DialogTitle>
                <DialogDescription>
                  Заполните необходимые поля для создания новой темы.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Название темы
                  </label>
                  <Input
                    id="title"
                    placeholder="Введите название темы"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Описание (необязательно)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Добавьте краткое описание темы"
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleCreateTopic}
                  disabled={!newTopicTitle.trim()}
                >
                  Создать тему
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.id}`}
              className="block"
            >
              <Card className="w-full hover:border-primary/50 transition-colors bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{topic.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.messageCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(topic.lastActive)}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}

          {topics.length === 0 && (
            <Card className="w-full bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">В этой категории пока нет тем.</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  Создать первую тему
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="bg-secondary py-6 mt-8 border-t border-border">
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

export default CategoryPage;
