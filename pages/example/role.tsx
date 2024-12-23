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
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { RoleCreateDTO, RoleUpdateDTO } from "hooks/role/role-schema";
import { useRoleStore } from "hooks/role/role-store";

function RoleTable() {
  // Pagination state
  const [page, setPage] = useState(1);

  // Role store integration
  const { roles, fetchRoles, updateRole, createRole, deleteRole } = useRoleStore();

  // Pagination setup
  const resultsPerPage = 10;
  const totalResults = roles.length;

  // Paginated data
  const [paginatedRoles, setPaginatedRoles] = useState([]);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingRole, setEditingRole] = useState<RoleUpdateDTO | null>(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const [newRole, setNewRole] = useState<RoleCreateDTO>({
    name: "New Role",
    description: "Role description",
    createdById: 1,
  });

  // Handle page change
  const onPageChange = (p: number) => {
    setPage(p);
  };

  // Fetch roles from the store on component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Update paginated data whenever roles or page changes
  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedRoles(roles.slice(startIndex, endIndex));
  }, [roles, page]);

  // Handle opening the modal for editing
  const openEditModal = (role: any) => {
    setEditingRole({
      id: role.id,
      name: role.name,
      description: role.description,
      updatedById: 1, // Example value, replace with logged-in user ID
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRole(null);
  };

  const openCreateModal = () => {
    setNewRole({
      name: "New Role",
      description: "Role description",
      createdById: 1,
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      await updateRole(editingRole.id, editingRole);
      closeEditModal();
      fetchRoles(); // Refresh the role list
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleCreateRole = async () => {
    try {
      await createRole(newRole);
      closeCreateModal();
      fetchRoles(); // Refresh the role list
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id);
      closeDeleteModal();
      fetchRoles(); // Refresh the role list
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const openDeleteModal = (role: any) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setRoleToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Role List</PageTitle>
        <Button onClick={openCreateModal} className="mb-4">Create Role</Button>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedRoles.sort((a: any, b: any) => a.id - b.id).map((role: any) => (
              <TableRow key={role.id}>
                <TableCell>
                  <span className="text-sm">{role.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{role.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{role.description}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Edit"
                      onClick={() => openEditModal(role)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(role)}
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
      {editingRole && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalHeader>Edit Role - {editingRole.name}</ModalHeader>
          <ModalBody>
            <Label>
              <span>Role Name</span>
              <Input
                className="mt-1"
                value={editingRole.name}
                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Description</span>
              <Input
                className="mt-1"
                value={editingRole.description}
                onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
              />
            </Label>
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Save</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create Role</ModalHeader>
        <ModalBody>
          <Label>
            <span>Role Name</span>
            <Input
              className="mt-1"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Description</span>
            <Input
              className="mt-1"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            />
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleCreateRole}>Save</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Delete Role - {roleToDelete?.id}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the role: <b>{roleToDelete?.name}</b>?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteRole}>Delete</Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default RoleTable;

