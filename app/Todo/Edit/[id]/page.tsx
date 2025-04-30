'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditTodo() {
  const [todo, setTodo] = useState({ title: '', description: '', completed: false });
  const router = useRouter();
  const { id } = useParams();

  // Fetch todo by ID
  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/Todo/${id}`);
      const data = await response.json();
      setTodo(data.todo);
    } catch (error) {
      toast.error('Failed to fetch todo');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update todo');
      }

      toast.success('Todo updated successfully');
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update todo');
      } else {
        toast.error('Failed to update todo');
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchTodo();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Edit Todo</h1>

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
                id = "completed"
                checked={todo.completed}
                className="cursor-pointer text-black"
                onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
              />
              <label htmlFor="completed" className='text-black'>Completed</label>
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
