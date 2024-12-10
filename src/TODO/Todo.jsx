import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Check, Edit2, Save, Clock } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      // Ensure all tasks have a priority
      const parsedTasks = JSON.parse(savedTasks);
      return parsedTasks.map(task => ({
        ...task,
        priority: task.priority || 'medium' // Set default priority if not present
      }));
    }
    return [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const priorities = {
    low: { color: 'bg-green-100 text-green-700', label: 'Low' },
    medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
    high: { color: 'bg-pink-100 text-pink-700', label: 'High' }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now(), 
        text: newTask, 
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium' // Set default priority
      }]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id && !task.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        return { ...task, completed: true };
      }
      if (task.id === id && task.completed) {
        return { ...task, completed: false };
      }
      return task;
    }));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, text: editText } : task
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cyclePriority = (id) => {
    const priorityLevels = ['low', 'medium', 'high'];
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const currentIndex = priorityLevels.indexOf(task.priority || 'medium');
        const nextPriority = priorityLevels[(currentIndex + 1) % priorityLevels.length];
        return { ...task, priority: nextPriority };
      }
      return task;
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
          DreamSwift.
        </h1>
        
        <form onSubmit={addTask} className="mb-8 transform hover:scale-105 transition-transform">
          <div className="relative">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full px-6 py-4 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 pr-12"
              placeholder="What's on your mind?"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600 transition-colors"
            >
              <PlusCircle size={24} />
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-4 shadow-lg transform transition-all duration-200 hover:scale-105 
                ${task.completed ? 'bg-opacity-75' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transform transition-transform hover:scale-110
                      ${task.completed 
                        ? 'border-green-400 bg-green-400 text-white' 
                        : 'border-pink-400 hover:border-pink-500'}`}
                  >
                    {task.completed && <Check size={14} />}
                  </button>
                  
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 border-b-2 border-pink-300 focus:outline-none focus:border-pink-500"
                      autoFocus
                    />
                  ) : (
                    <span className={`flex-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => cyclePriority(task.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorities[task.priority || 'medium'].color}`}
                  >
                    {priorities[task.priority || 'medium'].label}
                  </button>
                  
                  <div className="flex space-x-2">
                    {editingId === task.id ? (
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="text-green-500 hover:text-green-600 transform transition-transform hover:scale-110"
                      >
                        <Save size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(task)}
                        className="text-gray-400 hover:text-gray-600 transform transition-transform hover:scale-110"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-pink-400 hover:text-pink-600 transform transition-transform hover:scale-110"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDate(task.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <div className="text-gray-500">
              Your canvas is empty! Add a task to begin your journey.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;