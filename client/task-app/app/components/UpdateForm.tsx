import React from "react";

interface TaskData {
  name: string;
  description: string;
  status: string;
}

interface UpdateFormProps {
  taskData: TaskData;
  handleSetUpdateTask: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateSubmit: (e: React.FormEvent) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  taskData,
  handleSetUpdateTask,
  handleUpdateSubmit,
}) => {
  return (
    <form onSubmit={handleUpdateSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Task"
        value={taskData.name}
        onChange={handleSetUpdateTask}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={taskData.description}
        onChange={handleSetUpdateTask}
        className="border p-2 w-full mt-2"
      />
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={taskData.status}
        onChange={handleSetUpdateTask}
        className="border p-2 w-full mt-2"
      />

      <button
        type="submit"
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Enter
      </button>
    </form>
  );
};

export default UpdateForm;
