"use client";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  const adminPin = "1234";
  const router = useRouter();

  // LOAD PEOPLE FROM FIREBASE
  useEffect(() => {
    const loadPeople = async () => {
      const snapshot = await getDocs(collection(db, "people"));
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setList(data);
    };
    loadPeople();
  }, []);

  // ADD PERSON
  const addName = async () => {
    const pin = prompt("Enter Admin PIN");
    if (pin !== adminPin) {
      alert("Access denied. Admin only.");
      return;
    }
    if (!name.trim()) return;

    const docRef = await addDoc(collection(db, "people"), {
      name,
      createdAt: new Date(),
    });

    setList([...list, { id: docRef.id, name }]);
    setName("");
  };

  // EDIT PERSON
  const editName = async (id, oldName) => {
    const pin = prompt("Enter Admin PIN");
    if (pin !== adminPin) {
      alert("Access denied. Admin only.");
      return;
    }

    const newName = prompt("Enter new name", oldName);
    if (!newName) return;

    await updateDoc(doc(db, "people", id), { name: newName });

    setList(
      list.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  // DELETE PERSON
  const deletePerson = async (id) => {
    const pin = prompt("Enter Admin PIN");
    if (pin !== adminPin) {
      alert("Access denied. Admin only.");
      return;
    }

    await deleteDoc(doc(db, "people", id));
    setList(list.filter((p) => p.id !== id));
  };

  // OPEN TASK PAGE
  const openTasks = (personId) => {
    router.push(`/tasks?personId=${personId}`);
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
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => openTasks(item.id)}
            >
              <p className="text-lg font-medium">{item.name}</p>

              <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <FiEdit
                  className="text-blue-600 text-xl cursor-pointer"
                  onClick={() => editName(item.id, item.name)}
                />
                <FiTrash2
                  className="text-red-600 text-xl cursor-pointer"
                  onClick={() => deletePerson(item.id)}
                />
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <p className="text-center text-gray-500">
              No people added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
