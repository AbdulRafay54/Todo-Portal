"use client";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function TaskPage() {
  const [taskName, setTaskName] = useState("");
  const [progress] = useState(50); 

  const addTask = () => {
    if (!taskName) return;
    alert(`Task "${taskName}" added!`);
    setTaskName("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center space-y-6">

      {/* Task Input */}
      <div className="bg-white p-4 rounded-xl shadow w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Enter task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Graph */}
      <div className="w-32 h-32">
        <CircularProgressbar value={progress} text={`${progress}%`} />
      </div>

    </div>
  );
}
