interface FormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  taskData: { task: string; description: string };
  handleSetTask: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({
  handleSubmit,
  taskData,
  handleSetTask,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="task"
        placeholder="Task"
        value={taskData.task}
        onChange={handleSetTask}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={taskData.description}
        onChange={handleSetTask}
        className="border p-2 w-full mt-2"
      />

      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Enter
      </button>
    </form>
  );
};

export default Form;
