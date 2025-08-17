// lib/googleTasks.ts
interface GoogleTask {
  id?: string;
  title: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
  completed?: string; // ISO 8601 timestamp
  deleted?: boolean;
  hidden?: boolean;
  position?: string;
  parent?: string;
}

interface TaskList {
  id: string;
  title: string;
}

// Get all task lists
export async function getTaskLists(accessToken: string) {
  const res = await fetch(
    'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch task lists: ${res.statusText}`);
  }
  
  return await res.json();
}

// Get tasks from a specific list
export async function getTasks(accessToken: string, taskListId = '@default', options: {
  showCompleted?: boolean;
  showHidden?: boolean;
  dueMin?: string;
  dueMax?: string;
} = {}) {
  const params = new URLSearchParams();
  
  if (options.showCompleted !== undefined) {
    params.append('showCompleted', options.showCompleted.toString());
  }
  if (options.showHidden !== undefined) {
    params.append('showHidden', options.showHidden.toString());
  }
  if (options.dueMin) {
    params.append('dueMin', options.dueMin);
  }
  if (options.dueMax) {
    params.append('dueMax', options.dueMax);
  }

  const url = `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }

  return await res.json();
}

// Add a new task
export async function addTask(
  accessToken: string,
  task: GoogleTask,
  taskListId = '@default'
) {
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(task)
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to add task: ${res.statusText}`);
  }

  return await res.json();
}

// Update an existing task
export async function updateTask(
  accessToken: string,
  taskId: string,
  task: Partial<GoogleTask>,
  taskListId = '@default'
) {
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
    {
      method: 'PATCH', // Using PATCH instead of PUT to allow partial updates
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(task)
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.statusText}`);
  }

  return await res.json();
}

// Delete a task
export async function deleteTask(
  accessToken: string,
  taskId: string,
  taskListId = '@default'
) {
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.statusText}`);
  }

  return true;
}

// Move a task to a different position
export async function moveTask(
  accessToken: string,
  taskId: string,
  parent: string | null,
  previous: string | null,
  taskListId = '@default'
) {
  const params = new URLSearchParams();
  
  if (parent) {
    params.append('parent', parent);
  }
  if (previous) {
    params.append('previous', previous);
  }

  const url = `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}/move?${params.toString()}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to move task: ${res.statusText}`);
  }

  return await res.json();
}

// Clear all completed tasks
export async function clearCompletedTasks(
  accessToken: string,
  taskListId = '@default'
) {
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to clear completed tasks: ${res.statusText}`);
  }

  return true;
}