"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Home() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  const adminPin = "1234";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("names")) || [];
    setList(saved);
  }, []);

  const saveLocal = (data) => localStorage.setItem("names", JSON.stringify(data));

  const addName = () => {
    if (!name.trim()) return;
    const updated = [...list, { id: uuidv4(), name }];
    setList(updated);
    saveLocal(updated);
    setName("");
  };

  const editName = (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    const updated = list.map((p) => (p.id === id ? { ...p, name: newName } : p));
    setList(updated);
    saveLocal(updated);
  };

  const deletePerson = (id) => {
    const pin = prompt("Enter admin PIN to delete:");
    if (pin !== adminPin) return alert("Wrong PIN. Only admin can delete.");
    const updated = list.filter((p) => p.id !== id);
    setList(updated);
    saveLocal(updated);
   
    localStorage.removeItem("tasks_" + id);
  };

  const openTasks = (person) => {
    localStorage.setItem("currentPerson", JSON.stringify(person));
    window.location.href = "/tasks";
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-center">Manage People</h1>

        <div className="flex gap-2">
          <input
            className="border p-3 rounded w-full"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addName}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {list.map((item) => {
            
            const tasks = JSON.parse(localStorage.getItem("tasks_" + item.id)) || [];
            return (
              <div
                key={item.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => openTasks(item)}
              >
                <div>
                  <p className="text-lg font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{tasks.length} task(s) assigned</p>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <FiEdit
                    className="text-blue-600 text-xl cursor-pointer"
                    onClick={() => editName(item.id)}
                  />
                  <FiTrash2
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => deletePerson(item.id)}
                  />
                </div>
              </div>
            );
          })}

          {list.length === 0 && <p className="text-center text-gray-500">No names added yet.</p>}
        </div>
      </div>
    </div>
  );
}
