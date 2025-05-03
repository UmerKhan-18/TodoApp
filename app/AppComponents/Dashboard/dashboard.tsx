'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { AppLogo } from '../AppLogo';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Omit<Todo, '_id'>>({
    title: '',
    description: '',
    completed: false,
  });
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const router = useRouter();

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/Todo', { credentials: 'include' });
      if (response.status === 401) return router.push('/');
      const data: { todos: Todo[] } = await response.json();
      setTodos(data.todos);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  const addTodo = async () => {
    if (!newTodo.title || !newTodo.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const response = await fetch('/api/Todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      });
      const data: { todo: Todo } = await response.json();
      setTodos([...todos, data.todo]);
      setNewTodo({ title: '', description: '', completed: false });
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`/api/Todo/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const redirectToEditPage = (id: string) => {
    router.push(`/Todo/Edit/${id}`);
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/Todo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      const data: { todo: Todo } = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? data.todo : t))
      );
      toast.success('Todo updated');
    } catch (err) {
      toast.error('Failed to update todo');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies to allow server-side session management
      });
  
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/'); // Redirect to the login page after successful logout
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  const renderEmptyMessage = () => {
    if (filter === 'completed') return "You haven't completed any tasks yet.";
    if (filter === 'incomplete') return "Well done! You've completed all your tasks.";
    return 'No tasks found. Add some todos to get started!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className='flex items-center justify-between mt-5 ml-8'>
        {/* My Todo Dashboard Heading */}
         {/* Logo on the left */}
          <AppLogo /> {/* Adjust size as needed */} 


          {/* Logout Button */}
        <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 mt-5 sm:mt-0 rounded-lg cursor-pointer hover:bg-red-600 sm:ml-8"
          >
            Logout
        </button>
        </div>
                    
          <h1 className="text-3xl font-bold text-center mb-8 mt-5 text-black">Dashboard</h1>
       

        {/* Add Todo */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Add New Todo</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full p-2 border rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full p-2 border rounded-lg text-black"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={newTodo.completed}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" 
                onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
              />
              <label htmlFor="completed" className="text-black">
                Completed
              </label>
            </div>
            <button
              onClick={addTodo}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-2 rounded-lg hover:opacity-90 flex items-center justify-center cursor-pointer"
            >
              <Plus size={18} className="mr-2" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex justify-center space-x-4 mb-6">
          {['all', 'completed', 'incomplete'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium ${
                filter === f
                  ? f === 'completed'
                    ? 'bg-green-500 text-white'
                    : f === 'incomplete'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-gray-700 font-medium bg-white p-4 rounded-lg shadow-md">{renderEmptyMessage()}</div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className='space-x-1 flex items-center'>
                  {/* Checkbox for completed state */}
                <input 
                id="default-checkbox" 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" 
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id)}
                />
                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"></label>

                  {/* Todo Title and Description */}
                  <div>
                  <h3
                    className={`text-lg font-semibold ${
                      todo.completed ? 'line-through text-gray-500' : 'text-black'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <p className="text-gray-700">{todo.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  
                  <button
                    onClick={() => redirectToEditPage(todo._id)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <Edit size={25} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex items-center cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
