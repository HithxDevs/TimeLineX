'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { getTasks, addTask, updateTask, deleteTask } from '@/app/lib/googleTasks';

export default function VerticalTimeline({ session: initialSession }) {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('09:00');
  const [editTodo, setEditTodo] = useState<{id: string, title: string, time: string} | null>(null);
  const [daysToShow, setDaysToShow] = useState(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.accessToken || initialSession?.accessToken) {
      loadTasks();
    }
  }, [session, initialSession, currentDate]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = session?.accessToken || initialSession?.accessToken;
      const tasks = await getTasks(token);
      setTodos(tasks.items || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const token = session?.accessToken || initialSession?.accessToken;
      const dueDate = new Date(currentDate);
      const [hours, minutes] = newTodoTime.split(':').map(Number);
      dueDate.setHours(hours, minutes, 0, 0);
      
      await addTask(token, {
        title: newTodo,
        notes: `Added at ${newTodoTime} on ${format(new Date(), 'MMM dd, yyyy')}`,
        due: dueDate.toISOString()
      });
      setNewTodo('');
      setNewTodoTime('09:00');
      await loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTodo = async () => {
    if (!editTodo?.title.trim()) return;
    
    try {
      const token = session?.accessToken || initialSession?.accessToken;
      const task = todos.find(t => t.id === editTodo.id);
      const dueDate = new Date(task.due);
      const [hours, minutes] = editTodo.time.split(':').map(Number);
      dueDate.setHours(hours, minutes);
      
      await updateTask(token, editTodo.id, {
        title: editTodo.title,
        due: dueDate.toISOString()
      });
      setEditTodo(null);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const token = session?.accessToken || initialSession?.accessToken;
      await updateTask(token, taskId, {
        status: currentStatus ? 'needsAction' : 'completed'
      });
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = session?.accessToken || initialSession?.accessToken;
      await deleteTask(token, taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < daysToShow; i++) {
      days.push(addDays(currentDate, i));
    }
    return days;
  };

  const days = generateDays();

  const getTasksForDay = (day: Date) => {
    return todos
      .filter(task => {
        if (!task.due) return false;
        const taskDate = new Date(task.due);
        return isSameDay(taskDate, day);
      })
      .sort((a, b) => {
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      });
  };

  const getTaskTime = (dueString: string) => {
    const date = new Date(dueString);
    return format(date, 'HH:mm');
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? addDays(prev, -daysToShow) : addDays(prev, daysToShow)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (!session && !initialSession) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign In Required</h2>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow flex flex-col">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center bg-white gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            Today
          </button>
          <div className="flex space-x-2 items-center">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-1 rounded hover:bg-gray-100 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
              {format(days[0], 'MMM d')} - {format(days[days.length - 1], 'MMM d, yyyy')}
            </h2>
            <button 
              onClick={() => navigateDate('next')}
              className="p-1 rounded hover:bg-gray-100 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setDaysToShow(3)} 
            className={`px-3 py-1 text-sm rounded ${daysToShow === 3 ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
          >
            3 Days
          </button>
          <button 
            onClick={() => setDaysToShow(7)} 
            className={`px-3 py-1 text-sm rounded ${daysToShow === 7 ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setDaysToShow(14)} 
            className={`px-3 py-1 text-sm rounded ${daysToShow === 14 ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
          >
            2 Weeks
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200"></div>
        
        <div className="space-y-8 pl-8">
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={day.toString()} className="relative">
                <div className="absolute -left-8 top-0 w-4 h-4 rounded-full border-4 border-blue-500 bg-white transform -translate-x-1/2"></div>
                
                <div className={`p-3 rounded-lg ${isCurrentDay ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="font-medium text-lg text-gray-900">
                    {format(day, 'EEEE, MMMM d')}
                    {isCurrentDay && <span className="ml-2 text-blue-500">(Today)</span>}
                  </div>
                  
                  {loading ? (
                    <div className="mt-2 text-gray-700">Loading tasks...</div>
                  ) : dayTasks.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {dayTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded border ${task.status === 'completed' ? 
                            'border-green-200 bg-green-50' : 
                            'border-gray-200 bg-white'}`}
                        >
                          {editTodo?.id === task.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editTodo.title}
                                onChange={(e) => setEditTodo({...editTodo, title: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="time"
                                  value={editTodo.time}
                                  onChange={(e) => setEditTodo({...editTodo, time: e.target.value})}
                                  className="px-2 py-1 border rounded"
                                />
                                <button
                                  onClick={handleUpdateTodo}
                                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditTodo(null)}
                                  className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={() => toggleTaskCompletion(task.id, task.status === 'completed')}
                                className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className={`font-medium ${task.status === 'completed' ? 
                                      'line-through text-gray-600' : 
                                      'text-gray-900'}`}>
                                      {task.title}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      {getTaskTime(task.due)}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-2">
                                    <button
                                      onClick={() => setEditTodo({
                                        id: task.id, 
                                        title: task.title,
                                        time: getTaskTime(task.due)
                                      })}
                                      className="p-1 text-gray-500 hover:text-blue-500"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1 text-gray-500 hover:text-red-500"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                {task.notes && (
                                  <div className="text-sm text-gray-700 mt-1">
                                    {task.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-gray-700 italic">
                      No tasks for this day
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-white">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Task description"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="time"
              value={newTodoTime}
              onChange={(e) => setNewTodoTime(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={handleAddTodo}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Task will be added to {format(currentDate, 'MMMM d, yyyy')} at {newTodoTime}
          </div>
        </div>
      </div>
    </div>
  );
}