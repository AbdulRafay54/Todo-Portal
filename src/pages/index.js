"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

export default function Home() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);

  // Load saved people
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("names")) || [];
    setList(saved);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("names", JSON.stringify(data));
  };

  // Add new person
  const addName = () => {
    if (!name.trim()) return;

    const updated = [...list, { id: uuidv4(), name }];
    setList(updated);
    saveToLocalStorage(updated);
    setName("");
  };


  const editName = (i) => {
    const newName = prompt("Enter new name", list[i].name);
    if (!newName) return;

    const updated = [...list];
    updated[i].name = newName;
    setList(updated);
    saveToLocalStorage(updated);
  };

  const goToAssign = (i) => {
    localStorage.setItem("currentPerson", JSON.stringify(list[i]));
    window.location.href = "/tasks";
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Manage People</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-3 rounded w-full shadow-sm"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addName}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded"
        >
          Add
        </button>
      </div>

   
      <div className="space-y-4">
        {list.map((item, i) => {
          // Get tasks count for this person
          const tasks = JSON.parse(localStorage.getItem("tasks_" + item.id)) || [];
          return (
            <div
              key={i}
              className="border rounded p-4 flex items-center justify-between shadow-sm bg-white"
            >
              <div>
                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{tasks.length} tasks</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editName(i)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => goToAssign(i)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Assign Task
                </button>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <p className="text-center text-gray-500">No names added yet.</p>
        )}
      </div>
    </div>
  );
}
