'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLogo } from '../../../AppComponents/AppLogo';
import { Moon, Sun } from 'lucide-react';

export default function EditTodo() {
  const [todo, setTodo] = useState({ title: '', description: '', completed: false });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    setDarkMode(storedTheme === 'true');
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/Todo/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized: Please log in');
          router.push('/');
        } else if (response.status === 403) {
          toast.error('Forbidden: You do not own this todo');
          router.push('/');
        } else if (response.status === 404) {
          toast.error('Todo not found');
          router.push('/');
        } else {
          toast.error('Failed to fetch todo');
        }
        return;
      }

      const data = await response.json();
      setTodo(data.todo);
    } catch {
      toast.error('Failed to fetch todo');
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async () => {
    if (!todo.title || !todo.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/Todo/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized: Please log in');
          router.push('/');
        } else if (response.status === 403) {
          toast.error('Forbidden: You do not own this todo');
          router.push('/');
        } else {
          throw new Error(data.message || 'Failed to update todo');
        }
        return;
      }

      toast.success('Todo updated successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update todo');
    }
  };

  useEffect(() => {
    if (id) fetchTodo();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 text-black'}`}> 
        <div className={`animate-spin h-8 w-8 border-4 ${darkMode ? 'border-white' : 'border-black'}  border-t-transparent rounded-full`} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 text-black'} min-h-screen`}>
      <ToastContainer />

      <div className="flex items-center justify-between px-6 pt-6">
        <AppLogo />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Todo</h1>

        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-black'}`}
            />
            <input
              type="text"
              placeholder="Description"
              value={todo.description}
              onChange={(e) => setTodo({ ...todo, description: e.target.value })}
              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-black'}`}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={todo.completed}
                onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="completed" className="cursor-pointer">Completed</label>
            </div>
            <button
              onClick={updateTodo}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Update Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
