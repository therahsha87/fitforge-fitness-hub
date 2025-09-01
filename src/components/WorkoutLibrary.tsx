'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Play, 
  Clock, 
  Target, 
  TrendingUp,
  Filter,
  BookOpen,
  Dumbbell,
  Heart,
  Zap,
  Users,
  Star
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  muscles: string[];
  description: string;
  videoUrl?: string;
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  rating: number;
  participants: number;
  exercises: Exercise[];
}

const WorkoutLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const workoutPrograms: WorkoutProgram[] = [
    {
      id: '1',
      name: 'Upper Body Power',
      description: 'Build strength and muscle in your upper body with compound movements',
      duration: '45 min',
      difficulty: 'Intermediate',
      type: 'Strength',
      rating: 4.8,
      participants: 1240,
      exercises: []
    },
    {
      id: '2',
      name: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn',
      duration: '30 min',
      difficulty: 'Advanced',
      type: 'Cardio',
      rating: 4.9,
      participants: 2105,
      exercises: []
    },
    {
      id: '3',
      name: 'Full Body Beginner',
      description: 'Perfect introduction to weight training for beginners',
      duration: '35 min',
      difficulty: 'Beginner',
      type: 'Full Body',
      rating: 4.7,
      participants: 3200,
      exercises: []
    },
    {
      id: '4',
      name: 'Core & Abs Sculptor',
      description: 'Targeted core workout to build strength and definition',
      duration: '25 min',
      difficulty: 'Intermediate',
      type: 'Core',
      rating: 4.6,
      participants: 890,
      exercises: []
    }
  ];

  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Push-ups',
      category: 'Chest',
      duration: 30,
      difficulty: 'Beginner',
      equipment: ['Bodyweight'],
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      description: 'Classic bodyweight exercise for upper body strength',
    },
    {
      id: '2',
      name: 'Squats',
      category: 'Legs',
      duration: 45,
      difficulty: 'Beginner',
      equipment: ['Bodyweight'],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      description: 'Fundamental lower body compound movement',
    },
    {
      id: '3',
      name: 'Deadlifts',
      category: 'Back',
      duration: 60,
      difficulty: 'Advanced',
      equipment: ['Barbell', 'Weights'],
      muscles: ['Back', 'Hamstrings', 'Glutes'],
      description: 'King of all exercises for total body strength',
    },
    {
      id: '4',
      name: 'Mountain Climbers',
      category: 'Cardio',
      duration: 30,
      difficulty: 'Intermediate',
      equipment: ['Bodyweight'],
      muscles: ['Core', 'Legs', 'Shoulders'],
      description: 'Dynamic cardio exercise that builds endurance',
    }
  ];

  const categories = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredPrograms = workoutPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || program.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Strength': return <Dumbbell className="w-4 h-4" />;
      case 'Cardio': return <Heart className="w-4 h-4" />;
      case 'Full Body': return <Target className="w-4 h-4" />;
      case 'Core': return <Zap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span>Workout Library</span>
          </CardTitle>
          <p className="text-gray-600">
            Discover comprehensive workout programs and individual exercises for every fitness level
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search workouts and exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Difficulty</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="programs" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Workout Programs</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4" />
            <span>Individual Exercises</span>
          </TabsTrigger>
        </TabsList>

        {/* Workout Programs */}
        <TabsContent value="programs">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(program.type)}
                      <CardTitle className="text-xl">{program.name}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(program.difficulty)}>
                      {program.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{program.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{program.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{program.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Individual Exercises */}
        <TabsContent value="exercises">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{exercise.duration}s</span>
                      </div>
                      <Badge variant="secondary">{exercise.category}</Badge>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target Muscles:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscles.map((muscle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.equipment.map((eq, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Learn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <h3 className="text-lg font-bold">200+</h3>
            <p className="text-sm text-gray-600">Workout Programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <h3 className="text-lg font-bold">500+</h3>
            <p className="text-sm text-gray-600">Individual Exercises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <h3 className="text-lg font-bold">50K+</h3>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <h3 className="text-lg font-bold">4.8</h3>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutLibrary;
