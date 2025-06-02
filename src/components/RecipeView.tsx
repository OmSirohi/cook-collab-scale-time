
import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CookingTimer from '@/components/CookingTimer';

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

interface RecipeViewProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe, onBack, onEdit }) => {
  const [currentServings, setCurrentServings] = useState(recipe.servings);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  const scalingRatio = currentServings / recipe.servings;

  const scaleQuantity = (quantity: number) => {
    const scaled = quantity * scalingRatio;
    return Number(scaled.toFixed(2));
  };

  const startTimer = (stepIndex: number) => {
    setActiveTimer(stepIndex);
  };

  const stopTimer = () => {
    setActiveTimer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
            <p className="text-gray-600">{recipe.description}</p>
          </div>
          <Button onClick={onEdit} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Recipe Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">By {recipe.author}</span>
          </div>
          {recipe.collaborators.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-500">
                {recipe.collaborators.length} collaborator{recipe.collaborators.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <div className="flex gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-800">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ingredients
                  <div className="flex items-center gap-2">
                    <Label htmlFor="servings" className="text-sm font-normal">
                      Servings:
                    </Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={currentServings}
                      onChange={(e) => setCurrentServings(parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-800">{ingredient.name}</span>
                      <span className="font-medium text-orange-600">
                        {scaleQuantity(ingredient.quantity)} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
                {scalingRatio !== 1 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Quantities scaled {scalingRatio > 1 ? 'up' : 'down'} by {Math.abs(scalingRatio - 1).toFixed(1)}x
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="border-l-4 border-orange-200 pl-6 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-800 leading-relaxed">{step.instruction}</p>
                        {step.timerMinutes && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{step.timerMinutes} minutes</span>
                            </div>
                            {activeTimer === index ? (
                              <CookingTimer
                                minutes={step.timerMinutes}
                                onComplete={() => setActiveTimer(null)}
                                onStop={() => setActiveTimer(null)}
                              />
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startTimer(index)}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Start Timer
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;
