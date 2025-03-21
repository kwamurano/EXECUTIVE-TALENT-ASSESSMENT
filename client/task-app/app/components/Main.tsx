"use client";
import React, { useEffect, useState } from "react";
import { MdDeleteForever, MdModeEdit, MdOutlineSearch } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import Form from "./Form";
import axios from "axios";
import UpdateForm from "./UpdateForm";

interface Task {
  _id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "completed";
}

function Main() {
  const [tableData, setTableData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [addTask, setAddTask] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [taskData, setTaskData] = useState<{
    task: string;
    description: string;
  }>({
    task: "",
    description: "",
  });
  const [updateTaskData, setUpdateTaskData] = useState<Partial<Task>>({});

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:7000/tasks", {
        params: {
          page,
          limit: 5,
          status:
            selectedFilter !== "All" ? selectedFilter.toLowerCase() : undefined,
          search: search.trim() || undefined,
        },
      });
      setTableData(response.data.tasks);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedFilter, page]);

  if (loading) return <p>Loading...</p>;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  type FilterType = "All" | "Active" | "Pending" | "Completed";

  const handleFilterSelect = async (filter: FilterType) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);

    try {
      const response = await axios.get("http://localhost:7000/tasks", {
        params: {
          page,
          limit: 5,
          status: filter !== "All" ? filter.toLowerCase() : undefined,
        },
      });
      setTableData(response.data.tasks);
    } catch (error) {
      console.error("Error fetching filtered tasks:", error);
    }
  };

  const addtask = () => {
    setAddTask(true);
  };

  const handleEdit = (id: string) => {
    const taskToUpdate = tableData.find((task) => task._id === id);
    if (taskToUpdate) {
      setUpdateTaskData(taskToUpdate);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:7000/tasks/${id}`);
      console.log("Task deleted successfully");
      setTableData((prevTableData) =>
        prevTableData.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(e.target.value);

    if (!value.trim()) {
      fetchTasks();
      return;
    }

    try {
      let response;
      if (value.length === 24) {
        response = await axios.get(`http://localhost:7000/tasks/${value}`);
        setTableData(response.data ? [response.data] : []);
      } else {
        response = await axios.get("http://localhost:7000/tasks", {
          params: {
            page,
            limit: 10,
            search: value.trim(),
          },
        });
        setTableData(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      setTableData([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault;
    try {
      const response = await axios.post("http://localhost:7000/tasks", {
        name: taskData.task,
        description: taskData.description,
      });
      console.log("Task created:", response.data);

      setTaskData({ task: "", description: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
    setAddTask(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:7000/tasks/${updateTaskData._id}`,
        {
          name: updateTaskData.name,
          description: updateTaskData.description,
          status: updateTaskData.status,
        }
      );

      setTableData((prevTableData) =>
        prevTableData.map((task) =>
          task._id === updateTaskData._id ? response.data : task
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSetTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSetUpdateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(tableData);

  return (
    <div className="mt-10">
      <div className="justify-items-center">
        <button
          onClick={addtask}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Click to add a task
        </button>
        {addTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Form
                handleSubmit={handleSubmit}
                taskData={taskData}
                handleSetTask={handleSetTask}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleChange}
            className="outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <CiFilter className="text-xl" />
            <span>{selectedFilter}</span>
            <FaAngleDown />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-10">
              {" "}
              {(["All", "Active", "Pending", "Completed"] as FilterType[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterSelect(status)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <table className="border border-amber-600 w-full text-left">
        <thead>
          <tr className="bg-amber-200 border-b border-amber-600">
            <th className="border border-amber-600 px-4 py-2">S/N</th>
            <th className="border border-amber-600 px-4 py-2">Name</th>
            <th className="border border-amber-600 px-4 py-2">Description</th>
            <th className="border border-amber-600 px-4 py-2">Status</th>
            <th className="border border-amber-600 px-4 py-2">Edit</th>
            <th className="border border-amber-600 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={item._id} className="border-b border-amber-600">
              <td className="border border-amber-600 px-4 py-2">{index + 1}</td>
              <td className="border border-amber-600 px-4 py-2">{item.name}</td>
              <td className="border border-amber-600 px-4 py-2">
                {item.description}
              </td>
              <td className="border border-amber-600 px-4 py-2">
                {item.status}
              </td>
              <td className="border border-amber-600 px-4 py-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  <MdModeEdit />
                </button>
                {isModalOpen &&
                  updateTaskData &&
                  updateTaskData._id === item._id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-100">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <UpdateForm
                          taskData={{
                            name: updateTaskData.name ?? "",
                            description: updateTaskData.description ?? "",
                            status: updateTaskData.status ?? "Pending",
                          }}
                          // closeModal={closeModal}
                          handleSetUpdateTask={handleSetUpdateTask}
                          handleUpdateSubmit={handleUpdateSubmit}
                        />
                      </div>
                    </div>
                  )}
              </td>
              <td className="border border-amber-600 px-4 py-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <MdDeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 border rounded bg-white">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Main;
