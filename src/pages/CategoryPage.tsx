import { Link, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User } from "lucide-react";
import Logo from "@/components/ui/logo";

// Моковые данные для категорий
const categoryData = {
  general: {
    id: "general",
    name: "Общее обсуждение",
    description: "Обсуждение любых тем и новостей",
  },
  technology: {
    id: "technology",
    name: "Технологии",
    description: "Обсуждение гаджетов, программ и IT-новостей",
  },
  entertainment: {
    id: "entertainment",
    name: "Развлечения",
    description: "Фильмы, игры, музыка и другие развлечения",
  },
};

// Моковые данные для тем
const topicsData = {
  general: [
    {
      id: "1",
      title: "Приветственная тема",
      description: "Добро пожаловать на форум! Представьтесь сообществу.",
      author: "Аноним",
      lastActive: "2025-04-25T14:30:00",
      messageCount: 12,
    },
    {
      id: "2",
      title: "Последние новости",
      description: "Обсуждение новостей и актуальных событий.",
      author: "Аноним",
      lastActive: "2025-04-26T09:15:00",
      messageCount: 28,
    },
  ],
  technology: [
    {
      id: "3",
      title: "Новые телефоны 2025",
      description: "Обсуждение новинок мобильной техники этого года.",
      author: "Аноним",
      lastActive: "2025-04-24T18:45:00",
      messageCount: 34,
    },
    {
      id: "4",
      title: "Язык программирования Rust",
      description: "Делимся опытом использования Rust в проектах.",
      author: "Аноним",
      lastActive: "2025-04-25T11:20:00",
      messageCount: 15,
    },
  ],
  entertainment: [
    {
      id: "5",
      title: "Лучшие фильмы 2025",
      description: "Какие фильмы этого года вам понравились больше всего?",
      author: "Аноним",
      lastActive: "2025-04-26T10:30:00",
      messageCount: 22,
    },
    {
      id: "6",
      title: "Новые игры на ПК",
      description: "Обсуждение новых компьютерных игр и их особенностей.",
      author: "Аноним",
      lastActive: "2025-04-23T16:10:00",
      messageCount: 41,
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

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? categoryData[categoryId as keyof typeof categoryData] : null;
  const topics = categoryId ? topicsData[categoryId as keyof typeof topicsData] || [] : [];

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
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Темы в этой категории</h2>
          <Button as={Link} to={`/create-topic?category=${categoryId}`} className="bg-primary hover:bg-primary/90">
            Создать новую тему
          </Button>
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
                  as={Link} 
                  to={`/create-topic?category=${categoryId}`} 
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
