'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLogo } from '../../../AppComponents/AppLogo';

export default function EditTodo() {
  const [todo, setTodo] = useState({ title: '', description: '', completed: false });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  // Fetch todo by ID
  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/Todo/${id}`, {
        credentials: 'include', // IMPORTANT: include cookies
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
    } catch (error) {
      toast.error('Failed to fetch todo');
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async () => {
    if (!todo.title || !todo.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/Todo/${id}`, {
        method: 'PUT',
        credentials: 'include', // IMPORTANT: include cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized: Please log in');
          router.push('/login');
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
      <div className="min h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...
            </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
         <div className="flex items-center justify-between mt-5 ml-8">
            <AppLogo /> {/* Adjust size as needed */} 
        </div> 
        <h1 className="text-3xl font-bold text-center mb-8 mt-5 text-black">Edit Todo</h1>

        {/* Edit Todo Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              className="w-full p-2 border rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={todo.description}
              onChange={(e) => setTodo({ ...todo, description: e.target.value })}
              className="w-full p-2 border rounded-lg text-black"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={todo.completed}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" 
                onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
              />
              <label htmlFor="completed" className="text-black">Completed</label>
            </div>
            <button
              onClick={updateTodo}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              Update Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
