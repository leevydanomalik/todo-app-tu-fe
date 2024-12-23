import { create } from "zustand";
import Cookies from "js-cookie";
import { TaskRetrieveDTO, TaskCreateDTO, TaskUpdateDTO } from "./task-schema";

// Define API Base URL
const API_BASE_URL = process.env.NEXT_API_BASE_URL || "http://localhost:7777";


// Define Zustand State
interface TaskStore {
  tasks: TaskRetrieveDTO[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskCreateDTO) => Promise<void>;
  updateTask: (id: number, updatedTask: TaskUpdateDTO) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// Zustand Task Store
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  // Fetch Tasks
  fetchTasks: async () => {
  const authToken = Cookies.get("authToken"); // Retrieve token from cookies
  if (!authToken) {
    console.error("No credentials available. Please log in.");
    return;
  }

  set({ loading: true });
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`, // Use the token from cookies
      },
    });

    if (!response.ok) throw new Error("Failed to fetch tasks");

    const data: TaskRetrieveDTO[] = await response.json();
    set({ tasks: data });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  } finally {
    set({ loading: false });
  }
},

  // Create Task
createTask: async (task: TaskCreateDTO) => {
  const authToken = Cookies.get("authToken"); // Retrieve token from cookies
  console.log("save.task", task);

  if (!authToken) {
    console.error("No credentials available. Please log in.");
    return;
  }

  set({ loading: true });
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`, // Use the token from cookies
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Failed to create task");

    const newTask: TaskRetrieveDTO = await response.json();
    console.log("newtask", newTask);

    set((state) => ({ tasks: [...state.tasks, newTask] }));
  } catch (error) {
    console.error("Failed to create task:", error);
  } finally {
    set({ loading: false });
  }
},


  // Update Task
updateTask: async (id: number, updatedTask: TaskUpdateDTO) => {
  const authToken = Cookies.get("authToken"); // Retrieve token from cookies
  console.log("updatedTask, id", updatedTask, id);

  if (!authToken) {
    console.error("No credentials available. Please log in.");
    return;
  }

  set({ loading: true });
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`, // Use the token from cookies
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const updated: TaskRetrieveDTO = await response.json();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updated } : task
      ),
    }));
  } catch (error) {
    console.error("Failed to update task:", error);
  } finally {
    set({ loading: false });
  }
},


  // Delete Task
deleteTask: async (id: number) => {
  const authToken = Cookies.get("authToken"); // Retrieve token from cookies

  if (!authToken) {
    console.error("No credentials available. Please log in.");
    return;
  }

  set({ loading: true });
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${authToken}`, // Use the token from cookies
      },
    });

    if (!response.ok) throw new Error("Failed to delete task");

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  } catch (error) {
    console.error("Failed to delete task:", error);
  } finally {
    set({ loading: false });
  }
},

}));
