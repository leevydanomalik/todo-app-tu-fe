"use client"

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
import { EditIcon, SunIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { useTaskStore } from "hooks/task/task-store"; // Import task-store hook
import { TaskCreateDTO, TaskCreateSchema, TaskRetrieveDTO, TaskUpdateDTO, TaskUpdateSchema } from "hooks/task/task-schema";
import CTA from "example/components/CTA";
import SearchBar from "example/components/SearchBar";
import { useUserStore } from "hooks/user/user-store";
import { useUser } from "context/UserContext";
import ValidatedInput from "pages/shared/ValidatedInput";
import { z } from "zod";

function TaskTable() {

  // hooks

  const {user} = useUser();

  // Pagination state
  const [page, setPage] = useState(1);

  // Task store integration
  const { tasks, fetchTasks, updateTask, createTask, deleteTask, fetchTasksNext7day, fetchTasksToday, fetchTasksByUserName } = useTaskStore();

  // Pagination setup
  const resultsPerPage = 10;
  const totalResults = tasks.length;

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskUpdateDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null)

  const { users, fetchUsers } = useUserStore();

  // Fetch users when the modal is opened
  const [errors, setErrors] = useState<Record<string, string>>({});


  //
  const [searchQuery, setSearchQuery] = useState("");

  const filteredtasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTasks = filteredtasks.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );


  const [newTask, setNewTask] = useState<TaskCreateDTO>({
    title: "new task",
    description: "desc",
    deadline: new Date().toISOString().slice(0, -1),
    priority: "MEDIUM",
    assignedToId: 1,
    status: "TODO",
    createdById: user?.id ?? 1,
  });

  // Handle page change
  const onPageChange = (p: number) => {
    setPage(p);
  };

  // Fetch tasks from the store on component mount
  useEffect(() => {
    fetchTasksByUserName(user?.username || "none");
  }, [fetchTasksByUserName]);

  // Handle opening the modal for editing
  const openEditModal = (task: TaskRetrieveDTO) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignedToId: task.assignedTo.id,
      status: task.status,
      createdAt: task.createdAt,
      updatedById: user?.id ?? 1, // Example value, replace with logged-in user ID
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (isEditModalOpen) {
      fetchUsers();

      // Set a default user if not already assigned
      if (!editingTask?.assignedToId && users.length > 0) {
        setEditingTask({
          ...editingTask,
          assignedToId: users[1].id,
          status: editingTask?.status || "TODO",
          description: editingTask?.description || "",
          updatedById: editingTask?.updatedById || 0,
          title: editingTask?.title || "",
          deadline: editingTask?.deadline || "",
          priority: editingTask?.priority || "LOW",
        });
      }
    }
  }, [isEditModalOpen, fetchUsers, editingTask, setEditingTask, users]);


  // Handle closing the modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const openCreateModal = () => {
    setNewTask({
      title: "Add new title",
      description: "Add new description",
      deadline: new Date().toISOString().slice(0, -1),
      priority: "MEDIUM",
      assignedToId: 1,
      status: "TODO",
      createdById: 1,
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };


  // Handle task update
  const handleUpdateTask = async () => {
    setErrors({});
    console.log("editingTask", editingTask);
    if (!editingTask) return;

    try {
      const payload = {
        ...editingTask,
        updatedById: user?.userId,
      };
      console.log("payload.update", payload);

      const validatedPayload = TaskUpdateSchema.parse(payload);
      console.log("validatedPayload.update", validatedPayload);
  

      await updateTask(editingTask.id, payload);
      closeEditModal();
      fetchTasksByUserName(user?.username); 
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and map Zod validation errors
        const errorMessages = error.errors.reduce((acc: Record<string, string>, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        }, {});
        console.error("Zod validation errors:", errorMessages); // Debugging log
        setErrors(errorMessages); // Update the `errors` state for UI display
      } else {
        // Handle unexpected errors
        console.error("Unexpected error during task creation:", error);
      }
    }
  };


const handleCreateTask = async () => {
  console.log("payload.task", newTask);
  try {
    const payload = {
      ...newTask,
      createdById: user?.userId,
    };

    // Validate the payload with Zod
    const validatedPayload = TaskCreateSchema.parse(payload);
    console.log("validatedPayload.save", validatedPayload);

    // If validation passes, create the task
    await createTask(validatedPayload);
    closeCreateModal();
    fetchTasksByUserName(user?.username); // Refresh the task list
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract and map Zod validation errors
      const errorMessages = error.errors.reduce((acc: Record<string, string>, curr) => {
        acc[curr.path[0] as string] = curr.message;
        return acc;
      }, {});
      console.error("Zod validation errors:", errorMessages); // Debugging log
      setErrors(errorMessages); // Update the `errors` state for UI display
    } else {
      // Handle unexpected errors
      console.error("Unexpected error during task creation:", error);
    }
  }
};



  const handleDeleteTask = async () => {

    console.log("task.to.delete", taskToDelete)
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };


  // handle task today
  const handleCreateTaskToday = async () => {
    console.log("payload.task.today");
    try {
      await fetchTasksToday(user?.username);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };


  // hanlde task next 7 day
  const handleCreateTask7day = async () => {
    console.log("payload.task.7day");
    try {
      await fetchTasksNext7day(user?.username);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

    // hanlde task next 7 day
    const handleTaskAll = async () => {
      console.log("payload.task.all");
      try {
        if (user?.roles?.includes('ROLE_ADMIN')) {
          // Fetch all tasks if the user has the admin role
          await fetchTasks();
        } else {
          // Fetch tasks by username for other roles
          await fetchTasksByUserName(user?.username);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    


  const openDeleteModal = (task: any) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const getBadgeColor = (status:any) => {
    switch (status) {
      case "COMPLETED":
        return "bg-red-500 text-white";
      case "TODO":
        return "bg-gray-500 text-white";
      case "IN_PROGRESS":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black"; // Default badge style
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Task List - {user?.username || "N/A"} {user?.userId}</PageTitle>
        <div className="flex space-x-2 items-center justify-between">
          <Input
            className="input mt-1 w-[300px]"
            placeholder="Search by Task Name, Priority, Status"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button onClick={handleCreateTaskToday}>
            <span>Task Today</span>
          </Button>
          <Button onClick={handleCreateTask7day}>
            <span>Task Next 7 Days</span>
          </Button>
          <Button onClick={handleTaskAll}>
            <span>Task All</span>
          </Button>
          <Button onClick={openCreateModal}>
            <span>+ Create Task</span>
          </Button>
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedTasks.sort((a: any, b: any) => a.id - b.id).map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>
                  <span className="text-sm">{task.id}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Deadline: <span className="font-bold font-sans">{new Date(task.deadline).toLocaleString()}</span></p>
                    <div className='flex space-x-2 mt-2'>
                      <Badge className={`text-xs ${getBadgeColor(task.status)}`}>status: {task.status}</Badge>
                      <Badge className='text-xs'>priority: {task.priority}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={`https://randomuser.me/api/portraits/men/${user?.userId}.jpg`}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{task.assignedTo?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.assignedTo?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.createdBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.createdBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.updatedBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.updatedBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.updatedAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Edit"
                      onClick={() => openEditModal(task)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(task)}
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
      {editingTask && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalHeader>Edit Task - {editingTask.title} - {editingTask.id}</ModalHeader>
          <ModalBody>



            {/* <Label>
              <span>Title</span>
              <Input
                className="mt-1"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
            </Label> */}

          <ValidatedInput
            label="Task Title"
            value={editingTask.title}
            onChange={(value) => setEditingTask({ ...editingTask, title: value })}
            error={errors.title}
          />


            {/* <Label className="mt-4">
              <span>Description</span>
              <Input
                className="mt-1"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              />
            </Label> */}


            <ValidatedInput
            label="Task Title"
            value={editingTask.description}
            onChange={(value) => setEditingTask({ ...editingTask, description: value })}
            error={errors.title}
          />


            <Label className="mt-4">
              <span>Assign To</span>
              <Select
                className="mt-1"
                value={editingTask?.assignedToId || ""}
                onChange={(e) =>
                  setEditingTask((prev) => ({ ...prev, assignedToId: parseInt(e.target.value) }))
                }
              >
                <option value="" disabled>Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </Label>
            <Label className="mt-4">
              <span>Deadline</span>
              <Input
                type="datetime-local"
                className="mt-1"
                value={new Date(editingTask.deadline).toISOString().slice(0, -1)}
                onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Priority</span>
              <Select
                className="mt-1"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </Label>
            <Label className="mt-4">
              <span>Status</span>
              <Select
                className="mt-1"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </Label>
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Save</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create Task</ModalHeader>
        <ModalBody>
          {/* <Label>
            <span>Title</span>
            <Input
              className="mt-1"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              minLength={3} // Requires at least 3 characters
              maxLength={100} // Limits to a maximum of 100 characters
              pattern="^[a-zA-Z0-9 ]+$" // Allows only alphanumeric characters and spaces
              title="Title should be between 3 and 100 characters and contain only letters, numbers, and spaces."
            />
          </Label> */}
          <ValidatedInput
            label="Task Title"
            value={newTask.title}
            onChange={(value) => setNewTask({ ...newTask, title: value })}
            error={errors.title}
          />


          {/* <Label className="mt-4">
            <span>Description</span>
            <Input
              className="mt-1"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Label> */}


          <ValidatedInput
            label="Description"
            value={newTask.description}
            onChange={(value) => setNewTask({ ...newTask, description: value })}
            error={errors.description}
          />


          <Label className="mt-4">
            <span>Assign To</span>
            <Select
              className="mt-1"
              value={newTask.assignedToId}
              onChange={(e) => setNewTask({ ...newTask, assignedToId: parseInt(e.target.value) })}
            >
              <option value="" disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </Label>
          <Label className="mt-4">
            <span>Deadline</span>
            <Input
              type="datetime-local"
              className="mt-1"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Priority</span>
            <Select
              className="mt-1"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </Label>
          <Label className="mt-4">
            <span>Status</span>
            <Select
              className="mt-1"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Delete Task - {taskToDelete?.id}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the task: <b>{taskToDelete?.title}</b>?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteTask}>Delete</Button>
        </ModalFooter>
      </Modal>

    </Layout>
  );
}

export default TaskTable;
