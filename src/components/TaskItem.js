import React from 'react';
import { Link } from 'react-router-dom';

const timeRemaining = (deadline) => {
  const currentTime = new Date();
  const taskDeadline = new Date(deadline);
  const timeDiff = taskDeadline - currentTime;
  return timeDiff / (1000 * 3600);
};

const TaskItem = ({ task, onDelete, onUpdateStatus }) => {
  const handleDelete = async () => {
    if (typeof onDelete === 'function') {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
      }
    } else {
      console.error('onDelete не является функцией');
    }
  };


  // Условие для выделения задачи (если статус не "выполнено" и дедлайн близится)
  const deadlineWarning = task.status !== 'выполнено' && task.datetime_to_do && timeRemaining(task.datetime_to_do) < 24;

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '10px',
      margin: '10px 0',
      backgroundColor: deadlineWarning ? '#ffcccc' : 'white'
    }}>
      <h3>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h3>
      <p><strong>Описание:</strong> {task.task_info}</p>
      <p><strong>Приоритет:</strong> {task.priority}</p>
      <p><strong>Статус:</strong> {task.status}</p>
      <p><strong>Дата выполнения:</strong> {task.datetime_to_do || "Не указана"}</p>

      {deadlineWarning && <p style={{ color: 'red' }}>Дедлайн близится!</p>}

      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
};

export default TaskItem;
