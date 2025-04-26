
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, MessageSquare, User } from "lucide-react";

// Мок-данные для тем форума
const forumTopics = {
  general: [
    { 
      id: "gen1", 
      title: "Приветственная тема", 
      author: "Гость1234", 
      lastActive: "2 часа назад", 
      replies: 14,
      preview: "Добро пожаловать на наш форум! Здесь мы обсуждаем разные темы и делимся..."
    },
    { 
      id: "gen2", 
      title: "Новости сегодня", 
      author: "Новостник", 
      lastActive: "30 минут назад", 
      replies: 28,
      preview: "Обсуждаем свежие новости за сегодня. Что больше всего вас заинтересовало?"
    },
    { 
      id: "gen3", 
      title: "Вопрос к сообществу", 
      author: "Любознательный", 
      lastActive: "1 день назад", 
      replies: 7,
      preview: "Хотел спросить у всех, как вы считаете, стоит ли..."
    }
  ],
  technology: [
    { 
      id: "tech1", 
      title: "Новые технологии 2025", 
      author: "Технарь", 
      lastActive: "5 часов назад", 
      replies: 23,
      preview: "Какие технологические новинки вы ждете в этом году? Я лично..."
    },
    { 
      id: "tech2", 
      title: "Помогите с выбором ноутбука", 
      author: "Неопытный", 
      lastActive: "1 час назад", 
      replies: 19,
      preview: "Ищу ноутбук для работы и немного игр, бюджет до..."
    }
  ],
  entertainment: [
    { 
      id: "ent1", 
      title: "Новые фильмы апреля", 
      author: "Киноман", 
      lastActive: "3 часа назад", 
      replies: 17,
      preview: "В этом месяце вышло несколько интересных премьер. Кто что смотрел?"
    },
    { 
      id: "ent2", 
      title: "Обсуждаем последний сезон сериала", 
      author: "Сериаломан", 
      lastActive: "2 дня назад", 
      replies: 32,
      preview: "Как вам финал? По-моему, сценаристы совсем..."
    },
    { 
      id: "ent3", 
      title: "Музыкальные новинки", 
      author: "МеломанXXX", 
      lastActive: "8 часов назад", 
      replies: 9,
      preview: "Делюсь новыми треками, которые точно стоит послушать..."
    }
  ]
};

const categoryNames = {
  general: "Общее обсуждение",
  technology: "Технологии",
  entertainment: "Развлечения"
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const topics = categoryId ? forumTopics[categoryId as keyof typeof forumTopics] || [] : [];
  const categoryName = categoryId ? categoryNames[categoryId as keyof typeof categoryNames] || "Категория" : "Категория";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Темы для обсуждения</h2>
          <Button as={Link} to={`/category/${categoryId}/create`} className="bg-primary hover:bg-primary/90">
            Создать новую тему
          </Button>
        </div>

        {topics.length > 0 ? (
          <div className="space-y-4">
            {topics.map(topic => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    <Link to={`/topic/${topic.id}`} className="hover:text-primary hover:underline">
                      {topic.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 line-clamp-2">{topic.preview}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{topic.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.replies} ответов</span>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    Последняя активность: {topic.lastActive}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Нет тем для обсуждения</h3>
            <p className="text-gray-500 mb-6">Будьте первым, кто создаст тему в этой категории</p>
            <Button as={Link} to={`/category/${categoryId}/create`}>
              Создать тему
            </Button>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 ОткрытыйФорум - Общение без регистрации</p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;
