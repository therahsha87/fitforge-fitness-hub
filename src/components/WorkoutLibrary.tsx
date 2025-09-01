'use client'

import React, { useState } from 'react'

interface Exercise {
  id: string
  name: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  equipment: string
  muscles: string[]
  description: string
  videoUrl?: string
}

interface WorkoutProgram {
  id: string
  name: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  exercises: Exercise[]
  image: string
}

const WorkoutLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'programs'>('programs')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const workoutPrograms: WorkoutProgram[] = [
    {
      id: '1',
      name: 'Full Body Blast',
      duration: '45 min',
      difficulty: 'Intermediate',
      description: 'Complete full-body workout targeting all major muscle groups',
      exercises: [],
      image: '🔥'
    },
    {
      id: '2',
      name: 'HIIT Cardio',
      duration: '30 min',
      difficulty: 'Advanced',
      description: 'High-intensity interval training for maximum calorie burn',
      exercises: [],
      image: '⚡'
    },
    {
      id: '3',
      name: 'Beginner Strength',
      duration: '35 min',
      difficulty: 'Beginner',
      description: 'Perfect introduction to strength training',
      exercises: [],
      image: '💪'
    },
    {
      id: '4',
      name: 'Yoga Flow',
      duration: '60 min',
      difficulty: 'Beginner',
      description: 'Relaxing yoga sequence for flexibility and mindfulness',
      exercises: [],
      image: '🧘‍♀️'
    },
    {
      id: '5',
      name: 'Core Crusher',
      duration: '25 min',
      difficulty: 'Intermediate',
      description: 'Intense core workout for stronger abs',
      exercises: [],
      image: '🎯'
    },
    {
      id: '6',
      name: 'Upper Body Power',
      duration: '40 min',
      difficulty: 'Advanced',
      description: 'Advanced upper body strength and power development',
      exercises: [],
      image: '🏋️‍♂️'
    }
  ]

  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Push-ups',
      category: 'Chest',
      difficulty: 'Beginner',
      duration: '3 sets x 12 reps',
      equipment: 'Bodyweight',
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      description: 'Classic bodyweight exercise for upper body strength'
    },
    {
      id: '2',
      name: 'Squats',
      category: 'Legs',
      difficulty: 'Beginner',
      duration: '3 sets x 15 reps',
      equipment: 'Bodyweight',
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      description: 'Fundamental lower body movement pattern'
    },
    {
      id: '3',
      name: 'Deadlifts',
      category: 'Back',
      difficulty: 'Advanced',
      duration: '3 sets x 8 reps',
      equipment: 'Barbell',
      muscles: ['Hamstrings', 'Glutes', 'Back'],
      description: 'King of all exercises for posterior chain development'
    },
    {
      id: '4',
      name: 'Plank',
      category: 'Core',
      difficulty: 'Intermediate',
      duration: '3 sets x 45 sec',
      equipment: 'Bodyweight',
      muscles: ['Core', 'Shoulders'],
      description: 'Isometric exercise for core stability and strength'
    },
    {
      id: '5',
      name: 'Burpees',
      category: 'Cardio',
      difficulty: 'Advanced',
      duration: '3 sets x 10 reps',
      equipment: 'Bodyweight',
      muscles: ['Full Body'],
      description: 'Full-body explosive movement for cardio and strength'
    },
    {
      id: '6',
      name: 'Mountain Climbers',
      category: 'Cardio',
      difficulty: 'Intermediate',
      duration: '3 sets x 30 sec',
      equipment: 'Bodyweight',
      muscles: ['Core', 'Shoulders', 'Legs'],
      description: 'Dynamic cardio exercise targeting core and shoulders'
    }
  ]

  const categories = ['all', 'Chest', 'Back', 'Legs', 'Core', 'Cardio', 'Shoulders']
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']

  const filteredExercises = exercises.filter(exercise => {
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const filteredPrograms = workoutPrograms.filter(program => {
    const difficultyMatch = selectedDifficulty === 'all' || program.difficulty === selectedDifficulty
    return difficultyMatch
  })

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyBg = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'Advanced': return 'bg-red-500/20 border-red-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Workout Library</h1>
            <p className="text-gray-300">Discover workouts and exercises for every fitness level</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-purple-500/10 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'programs'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'exercises'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Exercises
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <div className="flex flex-wrap gap-4">
          {activeTab === 'exercises' && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'programs' ? (
        /* Workout Programs */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{program.image}</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyBg(program.difficulty)}`}>
                    <span className={getDifficultyColor(program.difficulty)}>
                      {program.difficulty}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{program.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>⏱️</span>
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>🎯</span>
                    <span>Full Body</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-colors">
                  Start Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Exercise List */
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyBg(exercise.difficulty)}`}>
                      <span className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{exercise.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>🎯</span>
                      <span>{exercise.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🏋️</span>
                      <span>{exercise.equipment}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles.map((muscle, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'programs' && filteredPrograms.length === 0) || 
        (activeTab === 'exercises' && filteredExercises.length === 0)) && (
        <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-12 border border-purple-500/20 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try adjusting your filters to see more options</p>
        </div>
      )}
    </div>
  )
}

export default WorkoutLibrary
