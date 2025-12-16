"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiTrash2 } from "react-icons/fi";


const getTasksFromStorage = (personId) => {
  return JSON.parse(localStorage.getItem("tasks_" + personId)) || [];
};

const saveTasksToStorage = (personId, tasks) => {
  localStorage.setItem("tasks_" + personId, JSON.stringify(tasks));
};

export default function TaskPage() {
  const adminPin = "1234";

  const [person, setPerson] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");

  
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("currentPerson"));
    if (!p) return;

    setPerson(p);
    setTasks(getTasksFromStorage(p.id));
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    saveTasksToStorage(person.id, updatedTasks);
  };

  
  const isExpired = (task) => {
    const today = new Date();
    const deadline = new Date(task.submissionDate + "T23:59:59");
    return !task.completed && today > deadline;
  };

  
  const addTask = () => {
    if (!taskName || !submissionDate)
      return alert("Task name aur date likho");

    const pin = prompt("Admin PIN:");
    if (pin !== adminPin) return alert("Wrong PIN");

    const newTask = {
      id: Date.now(),
      name: taskName,
      submissionDate,
      completed: false,
      late: false,
    };

    saveTasks([...tasks, newTask]);
    setTaskName("");
    setSubmissionDate("");
  };


  const markCompleted = (id) => {
    saveTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: true, late: false } : t
      )
    );
  };

  const markLateSubmitted = (id) => {
    saveTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: true, late: true } : t
      )
    );
  };

  const deleteTask = (id) => {
    const pin = prompt("Admin PIN:");
    if (pin !== adminPin) return alert("Wrong PIN");

    saveTasks(tasks.filter((t) => t.id !== id));
  };

  if (!person) return <p className="p-6 text-center">Loading...</p>;

  /Graph/

  const completed = tasks.filter((t) => t.completed && !t.late).length;
  const late = tasks.filter((t) => t.completed && t.late).length;
  const pending = tasks.filter((t) => !t.completed).length;

  const barData = [
    { name: "Completed", value: completed },
    { name: "Late", value: late },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-center">
        Task Dashboard • {person.name}
      </h1>

      {/* ADD TASK */}
      <div className="bg-white p-5 rounded-xl shadow max-w-md mx-auto">
        <h2 className="text-lg font-medium text-center mb-3">Add Task</h2>
        <div className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-medium mb-4">All Tasks</h2>

        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">
                  Due: {t.submissionDate}
                </p>
                <p
                  className={`font-medium ${
                    t.completed
                      ? t.late
                        ? "text-yellow-600"
                        : "text-green-600"
                      : isExpired(t)
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {t.completed
                    ? t.late
                      ? "Late Submitted"
                      : "Completed"
                    : isExpired(t)
                    ? "Deadline Missed"
                    : "Pending"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!t.completed && (
                  <select
                    className="border p-1 rounded"
                    onChange={(e) => {
                      if (e.target.value === "done") markCompleted(t.id);
                      if (e.target.value === "late") markLateSubmitted(t.id);
                    }}
                  >
                    <option value="">Action</option>
                    {!isExpired(t) && (
                      <option value="done">Mark Completed</option>
                    )}
                    {isExpired(t) && (
                      <option value="late">Mark Submitted</option>
                    )}
                  </select>
                )}

                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS + GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <p className="font-medium mb-2">Total Tasks</p>
          <div className="w-24 mx-auto">
            <CircularProgressbar value={tasks.length} text={tasks.length} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="font-medium text-center mb-2">Overview</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <p className="font-medium mb-2">Pending Tasks</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>

      </div>
    </div>
  );
}
