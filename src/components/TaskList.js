import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask } from '../services/api';
import TaskItem from './TaskItem';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', task_info: '', datetime_to_do: '' });

  useEffect(() => {
    if (!token || !user) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks(token);
        setTasks(data);
      } catch (err) {
        setError("Не удалось загрузить задачи");
        console.error(err);
      }
    };

    loadTasks();
  }, [token, user]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(token, taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      setError("Не удалось удалить задачу");
      console.error(error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.task_info) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const createdTask = await createTask(token, newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setShowCreateForm(false);
      setNewTask({ title: '', task_info: '', datetime_to_do: '' });
    } catch (error) {
      setError("Не удалось создать задачу");
      console.error(error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Загрузка...</div>;
  }

  const inProgressTasks = tasks.filter((task) => task.status === 'в прогрессе');
  const completedTasks = tasks.filter((task) => task.status === 'выполнено');

  return (
    <div>
      <h2>Список задач</h2>
      <button onClick={() => setShowCreateForm(true)}>Создать задачу</button>
      {showCreateForm && (
        <div className="create-task-form">
          <h3>Создать новую задачу</h3>
          <input
            type="text"
            placeholder="Заголовок"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Описание"
            value={newTask.task_info}
            onChange={(e) => setNewTask({ ...newTask, task_info: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="Дата выполнения"
            value={newTask.datetime_to_do}
            onChange={(e) => setNewTask({ ...newTask, datetime_to_do: e.target.value })}
          />
          <button onClick={handleCreateTask}>Сохранить</button>
          <button onClick={() => setShowCreateForm(false)}>Отмена</button>
        </div>
      )}

      {/* Список задач в процессе */}
      <div>
        <h3>Задачи в процессе</h3>
        {inProgressTasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={handleDelete}/>
        ))}
      </div>

      {/* Список выполненных задач */}
      <div>
        <h3>Выполненные задачи</h3>
        {completedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={handleDelete}/>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
