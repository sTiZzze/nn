import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskById, updateTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({});
  const { token } = useAuth();


  const statusOptions = [
    { value: "в прогрессе", label: "В прогрессе" },
    { value: "выполнено", label: "Выполнено" },
  ];

  const priorityOptions = [
    { value: "важно", label: "Важно" },
    { value: "средне", label: "Средне" },
  ];

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await fetchTaskById(id, token);
        setTask(data);
        setUpdatedTask({
          ...data,
          datetime_to_do: data.datetime_to_do
            ? new Date(data.datetime_to_do).toISOString().slice(0, 16)
            : "",
        });
      } catch (error) {
        setError("Не удалось загрузить данные задачи");
      }
    };

    if (token) {
      loadTask();
    } else {
      setError("Необходима авторизация");
    }
  }, [id, token]);

  const handleUpdateTask = async () => {
    try {
      const updatedData = await updateTask(id, token, updatedTask);
      setTask(updatedData);
      setIsEditing(false);
    } catch (error) {
      setError("Не удалось обновить задачу");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!task) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>{task.title}</h2>
      <p><strong>Описание:</strong> {task.task_info}</p>
      <p><strong>Приоритет:</strong> {task.priority}</p>
      <p><strong>Статус:</strong> {task.status}</p>
      <p><strong>Дата выполнения:</strong> {task.datetime_to_do || "Не указана"}</p>

      {isEditing ? (
        <div className="edit-task-form">
          <h3>Редактировать задачу</h3>
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={updatedTask.title || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="task_info"
            placeholder="Описание"
            value={updatedTask.task_info || ""}
            onChange={handleChange}
          />

          {/* Поле выбора для приоритета */}
          <label>Приоритет:
            <select
              name="priority"
              value={updatedTask.priority || ""}
              onChange={handleChange}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {/* Поле выбора для статуса */}
          <label>Статус:
            <select
              name="status"
              value={updatedTask.status || ""}
              onChange={handleChange}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <input
            type="datetime-local"
            name="datetime_to_do"
            value={updatedTask.datetime_to_do || ""}
            onChange={handleChange}
          />
          <button onClick={handleUpdateTask}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)}>Редактировать задачу</button>
      )}
    </div>
  );
};

export default TaskDetail;
