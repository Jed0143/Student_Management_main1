"use client";

import React, { useState, useEffect } from "react";
import Sidebar2 from "@/components/Sidebar2"; // Import sidebar

interface Module {
  id: number;
  name: string;
  price: number;
  stocks: number;
}

const ModulesList: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState<Module>({
    id: 0,
    name: "",
    price: 0,
    stocks: 0,
  });

  const [editedModules, setEditedModules] = useState<{
    [key: number]: { price: number; stocks: number };
  }>({});

  useEffect(() => {
    // Fetch modules from the database
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/module.php?action=fetch");
      const text = await response.text(); // Read raw response as text
      console.log('Response Text:', text); // Log the raw response to see what’s coming from the backend
  
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        try {
          const data = JSON.parse(text);
          // Convert price and stocks to numbers to avoid `.toFixed` error
          const formattedData: Module[] = data.map((module: any) => ({
            id: Number(module.id),
            name: module.name,
            price: Number(module.price),
            stocks: Number(module.stocks),
          }));
          setModules(formattedData); // Set state with formatted data
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
        }
      } else {
        console.error('Invalid JSON response:', text);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };
  

  const handleAddModule = async () => {
    if (!newModule.name || newModule.price <= 0 || newModule.stocks < 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newModule.name);
    formData.append("price", newModule.price.toString());
    formData.append("stocks", newModule.stocks.toString());
  
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/module.php", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      console.log('Add Module Response:', text);
  
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        const result = JSON.parse(text);
  
        if (result.message === "Module added successfully") {
          fetchModules(); // Refresh the module list
          setNewModule({ id: 0, name: "", price: 0, stocks: 0 }); // Reset form
        } else {
          alert(result.message);
        }
      } else {
        console.error('Invalid JSON response:', text);
        alert("Error: Invalid server response.");
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };  

  const handleEditModule = async (id: number) => {
    const edited = editedModules[id];
    if (!edited) return;

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("price", edited.price.toString());
    formData.append("stocks", edited.stocks.toString());

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/module.php?action=edit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.message === "Module updated successfully") {
        fetchModules(); // Refresh the module list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error editing module:", error);
    }
  };

  const handleDeleteModule = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this module?");
    if (confirmDelete) {
      const formData = new FormData();
      formData.append("id", id.toString());

      try {
        const response = await fetch("http://localhost/Student_Management_main1/backend/module.php?action=delete", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.message === "Module deleted successfully") {
          fetchModules(); // Refresh the module list
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleChange = (id: number, field: "price" | "stocks", value: number) => {
    setEditedModules((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex">
      <Sidebar2 children={undefined} />

      <div className="flex-1 p-8 transition-all duration-300">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Modules List</h1>

          <div className="mt-6">
            <h2 className="text-2xl mb-4">Add New Module</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="module-name" className="block mb-2 text-sm font-medium text-gray-700">
                  Module Name
                </label>
                <input
                  type="text"
                  id="module-name"
                  value={newModule.name}
                  onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  placeholder="Module Name"
                  className="px-4 py-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="module-price" className="block mb-2 text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="module-price"
                  value={newModule.price}
                  onChange={(e) => setNewModule({ ...newModule, price: parseFloat(e.target.value) })}
                  placeholder="Price"
                  className="px-4 py-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="module-stocks" className="block mb-2 text-sm font-medium text-gray-700">
                  Stocks
                </label>
                <input
                  type="number"
                  id="module-stocks"
                  value={newModule.stocks}
                  onChange={(e) => setNewModule({ ...newModule, stocks: parseInt(e.target.value, 10) })}
                  placeholder="Stocks"
                  className="px-4 py-2 border rounded-md w-full"
                />
              </div>
            </div>
            <button
              onClick={handleAddModule}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-6"
            >
              Add Module
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white text-lg">
                <th className="border px-4 py-3">E-Module Name</th>
                <th className="border px-4 py-3">Price</th>
                <th className="border px-4 py-3">Stocks</th>
                <th className="border px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-3">{module.name}</td>
                  <td className="border px-4 py-3">
                    <input
                      type="number"
                      value={editedModules[module.id]?.price ?? module.price}
                      onChange={(e) => handleChange(module.id, "price", parseFloat(e.target.value))}
                      className="px-4 py-2 border rounded-md w-24 text-center"
                    />
                  </td>
                  <td className="border px-4 py-3">
                    <input
                      type="number"
                      value={editedModules[module.id]?.stocks ?? module.stocks}
                      onChange={(e) => handleChange(module.id, "stocks", parseInt(e.target.value, 10))}
                      className="px-4 py-2 border rounded-md w-20 text-center"
                    />
                  </td>
                  <td className="border px-4 py-3">
                    <button
                      onClick={() => handleEditModule(module.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
  <h2 className="text-2xl mb-4">Module Summary Table</h2>
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-800 text-white text-lg">
          <th className="border px-4 py-3">Module</th>
          <th className="border px-4 py-3">Price</th>
          <th className="border px-4 py-3">Stocks</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module) => (
          <tr key={`summary-${module.id}`} className="text-center hover:bg-gray-100">
            <td className="border px-4 py-3">{module.name}</td>
            <td className="border px-4 py-3">₱{module.price.toFixed(2)}</td>
            <td className="border px-4 py-3">{module.stocks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default ModulesList;
