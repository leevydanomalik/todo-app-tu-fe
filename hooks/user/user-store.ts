
// import { create } from "zustand";
// import Cookies from "js-cookie";
// import { UserRetrieveDTO, UserCreateDTO, UserUpdateDTO } from "./user-schema";

// // Define API Base URL
// const API_BASE_URL = process.env.NEXT_API_BASE_URL || "http://localhost:7777";

// // Define Zustand State
// interface UserStore {
//   users: UserRetrieveDTO[];
//   loading: boolean;
//   fetchUsers: () => Promise<void>;
//   createUser: (user: UserCreateDTO) => Promise<void>;
//   updateUser: (id: number, updatedUser: UserUpdateDTO) => Promise<void>;
//   deleteUser: (id: number) => Promise<void>;
// }

// // Create Zustand User Store
// export const useUserStore = create<UserStore>((set, get) => ({
//   users: [],
//   loading: false,

//   // Fetch Users with Basic Auth
//   fetchUsers: async () => {
//     const { auth } = get();
//     if (!auth) {
//       console.error("No credentials available. Please log in.");
//       return;
//     }

//     set({ loading: true });
//     try {
//       const response = await fetch(`${API_BASE_URL}/users`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch users");

//       const data: UserRetrieveDTO[] = await response.json();
//       set({ users: data });
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Create User
//   createUser: async (user: UserCreateDTO) => {
//     const { auth } = get();
//     if (!auth) {
//       console.error("No credentials available. Please log in.");
//       return;
//     }

//     set({ loading: true });
//     try {
//       const response = await fetch(`${API_BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
//         },
//         body: JSON.stringify(user),
//       });

//       const newUser: UserRetrieveDTO = await response.json();
//       set((state) => ({ users: [...state.users, newUser] }));
//     } catch (error) {
//       console.error("Failed to create user:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Update User
//   updateUser: async (id: number, updatedUser: UserUpdateDTO) => {
//     const { auth } = get();
//     if (!auth) {
//       console.error("No credentials available. Please log in.");
//       return;
//     }

//     set({ loading: true });
//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
//         },
//         body: JSON.stringify(updatedUser),
//       });

//       const updated: UserRetrieveDTO = await response.json();
//       set((state) => ({
//         users: state.users.map((user) =>
//           user.id === id ? { ...user, ...updated } : user
//         ),
//       }));
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Delete User
//   deleteUser: async (id: number) => {
//     const { auth } = get();
//     if (!auth) {
//       console.error("No credentials available. Please log in.");
//       return;
//     }

//     set({ loading: true });
//     try {
//       await fetch(`${API_BASE_URL}/users/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
//         },
//       });

//       set((state) => ({
//         users: state.users.filter((user) => user.id !== id),
//       }));
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));


import { create } from "zustand";
import Cookies from "js-cookie";
import { UserRetrieveDTO, UserCreateDTO, UserUpdateDTO } from "./user-schema";

// Define API Base URL
const API_BASE_URL = process.env.NEXT_API_BASE_URL || "http://localhost:7777";

// Define Zustand State
interface UserStore {
  users: UserRetrieveDTO[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (user: UserCreateDTO) => Promise<void>;
  updateUser: (id: number, updatedUser: UserUpdateDTO) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

// Create Zustand User Store
export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,

  // Fetch Users with Cookie-Based Auth
  fetchUsers: async () => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data: UserRetrieveDTO[] = await response.json();
      set({ users: data });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Create User
  createUser: async (user: UserCreateDTO) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to create user");

      const newUser: UserRetrieveDTO = await response.json();
      set((state) => ({ users: [...state.users, newUser] }));
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Update User
  updateUser: async (id: number, updatedUser: UserUpdateDTO) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updated: UserRetrieveDTO = await response.json();
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...updated } : user
        ),
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Delete User
  deleteUser: async (id: number) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
