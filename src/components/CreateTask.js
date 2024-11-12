import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask } from '../services/api';

const CreateTask = () => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [taskInfo, setTaskInfo] = useState('');
  const [datetimeToDo, setDatetimeToDo] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(token, {
        title,
        task_info: taskInfo,
        datetime_to_do: datetimeToDo,
      });
      setMessage('Задача успешно создана');
      setTitle('');
      setTaskInfo('');
      setDatetimeToDo('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Создать новую задачу</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <input
            type="text"
            value={taskInfo}
            onChange={(e) => setTaskInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Дата выполнения:</label>
          <input
            type="datetime-local"
            value={datetimeToDo}
            onChange={(e) => setDatetimeToDo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Создать задачу</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTask;
