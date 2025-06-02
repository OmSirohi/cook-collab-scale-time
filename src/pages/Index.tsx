import React, { useState, useEffect } from 'react';
import { Plus, Clock, Users, ChefHat, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import RecipeModal from '@/components/RecipeModal';
import RecipeView from '@/components/RecipeView';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  description: string;
  servings: number;
  tags: string[];
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  steps: Array<{
    instruction: string;
    timerMinutes?: number;
  }>;
  author: string;
  collaborators: string[];
  isPublic: boolean;
}

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Classic Chocolate Chip Cookies',
      description: 'Perfectly chewy cookies with gooey chocolate chips',
      servings: 24,
      tags: ['Dessert', 'Quick'],
      ingredients: [
        { name: 'All-purpose flour', quantity: 2.25, unit: 'cups' },
        { name: 'Butter', quantity: 1, unit: 'cup' },
        { name: 'Brown sugar', quantity: 0.75, unit: 'cup' },
        { name: 'Chocolate chips', quantity: 2, unit: 'cups' }
      ],
      steps: [
        { instruction: 'Preheat oven to 375°F', timerMinutes: 10 },
        { instruction: 'Mix dry ingredients in a bowl' },
        { instruction: 'Cream butter and sugars', timerMinutes: 3 },
        { instruction: 'Bake for 9-11 minutes', timerMinutes: 10 }
      ],
      author: 'Chef Sarah',
      collaborators: ['baker123'],
      isPublic: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const handleCreateRecipe = (newRecipe: Omit<Recipe, 'id' | 'author' | 'collaborators'>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      author: 'Current User',
      collaborators: []
    };
    setRecipes([...recipes, recipe]);
    setIsModalOpen(false);
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully."
      });
      navigate('/auth');
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (viewingRecipe) {
    return (
      <RecipeView 
        recipe={viewingRecipe} 
        onBack={() => setViewingRecipe(null)}
        onEdit={() => {
          setSelectedRecipe(viewingRecipe);
          setViewingRecipe(null);
          setIsModalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Info */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="h-12 w-12 text-orange-600" />
              <h1 className="text-4xl font-bold text-gray-900">RecipeCollab</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, collaborate, and cook together. Scale recipes instantly and time your cooking perfectly.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">My Recipes</h2>
          <Button 
            onClick={() => {
              setSelectedRecipe(null);
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recipe
          </Button>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0 shadow-md"
              onClick={() => setViewingRecipe(recipe)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {recipe.title}
                  </CardTitle>
                  {recipe.collaborators.length > 0 && (
                    <Users className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  )}
                </div>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Serves {recipe.servings}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.steps.filter(s => s.timerMinutes).length} timers</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-orange-100 text-orange-800 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    By {recipe.author}
                    {recipe.collaborators.length > 0 && (
                      <span> • {recipe.collaborators.length} collaborator{recipe.collaborators.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No recipes yet</h3>
            <p className="text-gray-400 mb-6">Create your first recipe to get started!</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        )}
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(null);
        }}
        onSave={selectedRecipe ? handleUpdateRecipe : handleCreateRecipe}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default Index;
