import React, { useState, useEffect } from "react";

import PageTitle from "example/components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Select,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { useUserStore } from "hooks/user/user-store"; // Import user-store hook
import { UserCreateDTO, UserUpdateDTO } from "hooks/user/user-schema";
import { useRoleStore } from "hooks/role/role-store";

function UserTable() {
  // Pagination state
  const [page, setPage] = useState(1);

  // User store integration
  const { users, fetchUsers, updateUser, createUser, deleteUser } = useUserStore();
  const { roles, fetchRoles } = useRoleStore();

  // Pagination setup
  const resultsPerPage = 10;
  const totalResults = users.length;

  // Paginated data
  const [paginatedUsers, setPaginatedUsers] = useState([]);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<UserUpdateDTO | null>(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [newUser, setNewUser] = useState<UserCreateDTO>({
    username: "newuser",
    email: "newuser@example.com",
    password: "password",
    roleIds: [],
    status: "ACTIVE",
    createdById: 1,
  });

  // Handle page change
  const onPageChange = (p: number) => {
    setPage(p);
  };

  // Fetch users from the store on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update paginated data whenever users or page changes
  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedUsers(users.slice(startIndex, endIndex));
  }, [users, page]);

  useEffect(() => {
    fetchRoles(); // Fetch roles on component mount
  }, [fetchRoles]);

  // Handle opening the modal for editing
  const openEditModal = (user: any) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      status: user.status,
      roleIds: user.roleIds,
      updatedById: 1, // Example value, replace with logged-in user ID
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const openCreateModal = () => {
    setNewUser({
      username: "newuser",
      email: "newuser@example.com",
      password: "password",
      roleIds: [],
      status: "ACTIVE",
      createdById: 1,
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateUser = async () => {

    console.log("editingUser", editingUser);

    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, editingUser);
      closeEditModal();
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCreateUser = async () => {
    console.log("newUser", newUser);
    try {
      await createUser(newUser);
      closeCreateModal();
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      closeDeleteModal();
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>User List</PageTitle>
        <Button onClick={openCreateModal} className="mb-4">Create User</Button>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedUsers.sort((a: any, b: any) => a.id - b.id).map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <span className="text-sm">{user.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user?.avatar || "https://randomuser.me/api/portraits/men/39.jpg"}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.roles && user.roles.length > 0 ? user.roles[0].name : "No Role Assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Edit"
                      onClick={() => openEditModal(user)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(user)}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Edit Modal */}
      {editingUser && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalHeader>Edit User - {editingUser.username}</ModalHeader>
          <ModalBody>
            <Label>
              <span>Username</span>
              <Input
                className="mt-1"
                value={editingUser.username}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              />
            </Label>
            <Label>
              <span>Password</span>
              <Input
                className="mt-1"
                value={editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Email</span>
              <Input
                className="mt-1"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Status</span>
              <Select
                className="mt-1"
                value={editingUser?.status || "ACTIVE"} // Default to "ACTIVE" if status is undefined
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, status: e.target.value as "ACTIVE" | "INACTIVE" } : prev
                  )
                }
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </Label>
            <Label className="mt-4">
              <span>Roles</span>
              <Select
                className="mt-1"
                value={editingUser?.roleIds || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  );
                  setEditingUser((prev) =>
                    prev ? { ...prev, roleIds: selectedOptions } : prev
                  );
                }}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </Label>
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save</Button>
          </ModalFooter>
        </Modal>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create User</ModalHeader>
        <ModalBody>
          <Label>
            <span>Username</span>
            <Input
              className="mt-1"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </Label>
          <Label>
            <span>Password</span>
            <Input
              className="mt-1"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Email</span>
            <Input
              className="mt-1"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Status</span>
            <Select
              className="mt-1"
              value={newUser.status}
              onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "ACTIVE" | "INACTIVE" })} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </Label>
          <Label className="mt-4">
            <span>Roles</span>
            <Select
              className="mt-1"
              value={newUser.roleIds}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                );
                setNewUser({ ...newUser, roleIds: selectedOptions });
              }}
            >
              {/* Replace the options below with dynamic role data */}
              <option value={1}>Admin</option>
              <option value={2}>User</option>
              <option value={3}>Manager</option>
            </Select>
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleCreateUser}>Save</Button>
        </ModalFooter>
      </Modal>


      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Delete User - {userToDelete?.id}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the user: <b>{userToDelete?.username}</b>?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteUser}>Delete</Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default UserTable;
