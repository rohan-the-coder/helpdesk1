// src/pages/Admin/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import Loader from "../../components/Loader";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await categoryService.createCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Error creating category", err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="bg-[#1F1F1F] border border-gray-600 rounded px-4 py-2 text-white w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Add
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#1F1F1F] flex justify-between items-center p-4 rounded"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
