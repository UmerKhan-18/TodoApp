'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, LogOut, ListTodo, Menu, User, Settings, Moon, Sun } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Track Dark Mode state
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/Todo', { credentials: 'include' });
      if (response.status === 401) return router.push('/');
      const data: { todos: Todo[] } = await response.json();
      setTodos(data.todos);
    } catch {
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
    } catch {
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
    } catch {
      toast.error('Failed to delete todo');
    }
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
    } catch {
      toast.error('Failed to update todo');
    }
  };

  const redirectToEditPage = (id: string) => {
    router.push(`/Todo/Edit/${id}`);
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Logout failed');
      }
    } catch {
      toast.error('Error logging out');
    }
  };

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

  // Function to toggle Dark/Light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString()); // Save preference in localStorage
  };

  // Load theme from localStorage when the page loads
  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) setDarkMode(storedTheme === 'true');
  }, []);
  

  return (

    <div className={`min-h-screen  ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 text-black'}`}>
      <ToastContainer />

      {/* Header */}
      <header className={`hidden md:flex w-full p-4 shadow-sm  justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} fixed z-1000 `}>

        <h1 className="text-4xl font-bold mb-2 mt-2 ml-1 text-indigo-700 hidden md:block">Dashboard</h1>
        <AppLogo />
        <button
            onClick={logout}
            className="hidden md:flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            <LogOut size={18} className="mr-2" />
            Logout
        </button>
      </header>

      {/* Mobile Navbar */}
      <div className={`md:hidden flex items-center justify-between p-4 shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <AppLogo />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md"
        >
          <Menu />
        </button>
      </div>

      {/* Layout Container */}
      <div className="flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-6 flex flex-col justify-between fixed bottom-0 left-0 top-20 md:h-screen h-auto z-5 `}
      >
        <div>
          <nav className="space-y-2 mb-6">
            <button className={`flex items-center w-full text-left p-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gradient-to-r from-indigo-400 via-indigo-400 to-violet-500' : 'text-gray-700'} hover:bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 cursor-pointer`}>
              <ListTodo className="mr-2" size={18} />
              Todos
            </button>
          </nav>

          {/* Profile and Settings */}
          <div className="space-y-4 mb-6">
            <button className={`flex items-center w-full text-left p-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gradient-to-r from-indigo-400 via-indigo-400 to-violet-500' : 'text-gray-700'} hover:bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 cursor-pointer`}>
              <User className="mr-2" size={18} />
              Profile
            </button>
            <button className={`flex items-center w-full text-left p-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gradient-to-r from-indigo-400 via-indigo-400 to-violet-500' : 'text-gray-700'} hover:bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 cursor-pointer`}>
              <Settings className="mr-2" size={18} />
              Settings
            </button>
            <button
              onClick={toggleTheme} // Use the new toggleTheme function
              className={`flex items-center w-full text-left p-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gradient-to-r from-indigo-400 via-indigo-400 to-violet-500' : 'text-gray-700'} hover:bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300 cursor-pointer`}
            >
              {darkMode ? (
                <Sun className="mr-2" size={18} />
              ) : (
                <Moon className="mr-2" size={18} />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <button
              onClick={logout}
              className={`lg:hidden flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointe`}
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 min-h-screen overflow-y-auto md:ml-64 md:mt-24">
        {/* Add Todo */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Todo</h2> 
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full p-2 border rounded-lg text-gray-700"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full p-2 border rounded-lg text-gray-700"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={newTodo.completed}
                onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="completed" className="text-gray-700">
                Completed
              </label>
            </div>
            <button
              onClick={addTodo}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-2 rounded-lg hover:bg-indigo-600 flex items-center justify-center cursor-pointer"
            >
              <Plus size={18} className="mr-2" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center space-x-4 mb-6">
          {['all', 'completed', 'incomplete'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full cursor-pointer font-medium ${
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

        {/* Todos */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-gray-700 font-medium bg-white p-4 rounded-xl shadow">
              {renderEmptyMessage()}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <p className="text-gray-500">{todo.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => redirectToEditPage(todo._id)}
                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
    </div>
  );
}
