import { API_BASE_URL } from "../config";

export const fetchTasks = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/list`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Ошибка при получении данных");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
};

export const signup = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Ошибка регистрации");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
};

export const logout = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Ошибка выхода");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
};

export const login = async (username, password) => {
  const data = new URLSearchParams();
  data.append('grant_type', '');
  data.append('username', username);
  data.append('password', password);
  data.append('scope', '');
  data.append('client_id', '');
  data.append('client_secret', '');

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: data
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  const responseData = await response.json();
  console.log("Ответ от сервера:", responseData);

  if (responseData && responseData.access_token) {
    localStorage.setItem('token', responseData.access_token);
    try {
      const userResponse = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${responseData.access_token}`,
          "Accept": "application/json"
        }
      });

      if (!userResponse.ok) {
        throw new Error("Ошибка при получении данных о пользователе");
      }

      const userData = await userResponse.json();

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error("Ошибка: данные пользователя не получены");
      }

      return { user: userData, token: responseData.access_token };
    } catch (error) {
      return { user: null, token: responseData.access_token };
    }
  } else {
    return { user: null, token: null };
  }
};

export const createTask = async (token, taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/create`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) {
      throw new Error("Не удалось создать задачу");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка создания задачи:", error);
    throw error;
  }
};

export const fetchTaskById = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить данные задачи');
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке задачи:", error);
    throw error;
  }
};

export const updateTask = async (id, token, updatedTaskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTaskData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении задачи");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    throw error;
  }
};

export const deleteTask = async (token, taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось удалить задачу");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    throw error;
  }
};
