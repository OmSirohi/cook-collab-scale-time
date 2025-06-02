
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

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

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: any) => void;
  recipe?: Recipe | null;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSave, recipe }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 4,
    tags: [] as string[],
    ingredients: [{ name: '', quantity: 0, unit: '' }],
    steps: [{ instruction: '', timerMinutes: undefined as number | undefined }],
    isPublic: false
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        steps: recipe.steps.map(step => ({
          instruction: step.instruction,
          timerMinutes: step.timerMinutes
        })),
        isPublic: recipe.isPublic
      });
    } else {
      setFormData({
        title: '',
        description: '',
        servings: 4,
        tags: [],
        ingredients: [{ name: '', quantity: 0, unit: '' }],
        steps: [{ instruction: '', timerMinutes: undefined }],
        isPublic: false
      });
    }
  }, [recipe, isOpen]);

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: 0, unit: '' }]
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = formData.ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    );
    setFormData({ ...formData, ingredients: updated });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { instruction: '', timerMinutes: undefined }]
    });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    });
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updated = formData.steps.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );
    setFormData({ ...formData, steps: updated });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipe) {
      onSave({ ...recipe, ...formData });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter recipe title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your recipe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <Label htmlFor="isPublic">Make recipe public</Label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Ingredients</Label>
              <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-2"
                    type="number"
                    step="0.25"
                    placeholder="Qty"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    className="col-span-3"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  />
                  <Input
                    className="col-span-6"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="col-span-1"
                    onClick={() => removeIngredient(index)}
                    disabled={formData.ingredients.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Cooking Steps</Label>
              <Button type="button" onClick={addStep} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-600">Step {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      disabled={formData.steps.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Describe this cooking step"
                    value={step.instruction}
                    onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Timer (minutes)"
                      value={step.timerMinutes || ''}
                      onChange={(e) => updateStep(index, 'timerMinutes', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-500">Optional timer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
              {recipe ? 'Update Recipe' : 'Create Recipe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeModal;
