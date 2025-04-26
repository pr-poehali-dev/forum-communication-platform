
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

const forumCategories = [
  {
    id: "general",
    name: "Общее обсуждение",
    description: "Обсуждение любых тем и новостей",
    messageCount: 128,
    userCount: 45,
  },
  {
    id: "technology",
    name: "Технологии",
    description: "Обсуждение гаджетов, программ и IT-новостей",
    messageCount: 93,
    userCount: 28,
  },
  {
    id: "entertainment",
    name: "Развлечения",
    description: "Фильмы, игры, музыка и другие развлечения",
    messageCount: 76,
    userCount: 32,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">ОткрытыйФорум</h1>
          <p className="text-lg opacity-90">Общайтесь свободно, без регистрации</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Категории форума</h2>
          <Button as={Link} to="/create-topic" className="bg-primary hover:bg-primary/90">
            Создать новую тему
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forumCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="transform transition-transform hover:scale-105"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Присоединяйтесь к обсуждению и делитесь своими мыслями.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{category.messageCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{category.userCount}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 ОткрытыйФорум - Общение без регистрации</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
