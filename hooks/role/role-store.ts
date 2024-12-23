import { create } from "zustand";
import Cookies from "js-cookie";
import { RoleRetrieveDTO, RoleCreateDTO, RoleUpdateDTO } from "./role-schema";

// Define API Base URL
const API_BASE_URL = process.env.NEXT_API_BASE_URL || "http://localhost:7777";

// Define Zustand State
interface RoleStore {
  roles: RoleRetrieveDTO[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  createRole: (role: RoleCreateDTO) => Promise<void>;
  updateRole: (id: number, updatedRole: RoleUpdateDTO) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}

// Zustand Role Store
export const useRoleStore = create<RoleStore>((set) => ({
  roles: [],
  loading: false,

  // Fetch Roles with Cookie-Based Auth
  fetchRoles: async () => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
      });

      if (!response.ok) throw new Error("Failed to fetch roles");

      const data: RoleRetrieveDTO[] = await response.json();
      set({ roles: data });
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Create Role
  createRole: async (role: RoleCreateDTO) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
        body: JSON.stringify(role),
      });

      if (!response.ok) throw new Error("Failed to create role");

      const newRole: RoleRetrieveDTO = await response.json();
      set((state) => ({ roles: [...state.roles, newRole] }));
    } catch (error) {
      console.error("Failed to create role:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Update Role
  updateRole: async (id: number, updatedRole: RoleUpdateDTO) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
        body: JSON.stringify(updatedRole),
      });

      if (!response.ok) throw new Error("Failed to update role");

      const updated: RoleRetrieveDTO = await response.json();
      set((state) => ({
        roles: state.roles.map((role) =>
          role.id === id ? { ...role, ...updated } : role
        ),
      }));
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Delete Role
  deleteRole: async (id: number) => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      console.error("No credentials available. Please log in.");
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`, // Use token from cookies
        },
      });

      if (!response.ok) throw new Error("Failed to delete role");

      set((state) => ({
        roles: state.roles.filter((role) => role.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete role:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
