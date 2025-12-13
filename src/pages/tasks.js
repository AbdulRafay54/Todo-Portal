"use client";
import { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function TaskPage() {
  const [person, setPerson] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const adminPin = "1234";

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("currentPerson"));
    setPerson(p);
    if (p) {
      const saved = JSON.parse(localStorage.getItem("tasks_" + p.id)) || [];
      setTasks(saved);
    }
  }, []);

  const saveTasks = (data) =>
    localStorage.setItem("tasks_" + person.id, JSON.stringify(data));

  const addTask = () => {
    const pin = prompt("Enter Admin PIN to add task:");
    if (pin !== adminPin) {
      alert("Incorrect PIN. Only admin can add tasks.");
      return;
    }
    if (!taskName || !deadlineDate || !deadlineTime) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      createdOn: new Date().toLocaleString(),
      deadline: `${deadlineDate} ${deadlineTime}`,
      completed: false,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);

    setTaskName("");
    setDeadlineDate("");
    setDeadlineTime("");
    alert("Task added successfully by Admin.");
  };

  const markCompleted = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: true } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const pin = prompt("Enter Admin PIN to delete this task:");
    if (pin !== adminPin) {
      alert("Incorrect PIN. Only admin can delete tasks.");
      return;
    }
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
    alert("Task deleted successfully.");
  };

  const isExpired = (task) =>
    new Date(task.deadline) < new Date() && !task.completed;

  const progressPercent = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (!person) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Tasks for {person.name}</h1>

      {/* Input Section */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
        />
        <input
          type="time"
          className="w-full p-2 border rounded"
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
        />
        <button
          onClick={addTask}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

 
      {/* Circular Progress Chart */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
        <p className="font-medium mb-2">Progress</p>
        <div className="w-32 h-32">
          <CircularProgressbar
            value={progressPercent()}
            text={`${progressPercent()}%`}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-xl shadow">
            <p className="text-lg font-semibold">{t.name}</p>
            <p className="text-sm text-gray-500">Created: {t.createdOn}</p>
            <p className="text-sm text-gray-500">Deadline: {t.deadline}</p>

            {isExpired(t) && !t.completed && (
              <p className="text-red-600 font-medium mt-1">Deadline missed!</p>
            )}

            <div className="flex gap-3 mt-3">
              {!t.completed && !isExpired(t) && (
                <button
                  onClick={() => markCompleted(t.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Mark Completed
                </button>
              )}
              <button
                onClick={() => deleteTask(t.id)}
                className="text-red-600 px-3 py-1 border rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks yet.</p>
        )}
      </div>
    </div>
  );
}
