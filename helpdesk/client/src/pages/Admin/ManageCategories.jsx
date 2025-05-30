import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";
import Loader from "../../components/Loader";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setError("");
      const [categoriesData, agentsData] = await Promise.all([
        categoryService.getCategories(),
        userService.getAllUsers()
      ]);
      
      setCategories(categoriesData);
      setAgents(agentsData.filter(user => user.role === "Agent"));

      // Initialize selected agents based on category assignments
      const initialSelectedAgents = {};
      categoriesData.forEach(category => {
        initialSelectedAgents[category._id] = category.assignedAgents?.map(agent => agent._id) || [];
      });
      setSelectedAgents(initialSelectedAgents);
    } catch (err) {
      console.error("Failed to load data", err);
      setError("Failed to load categories and agents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await categoryService.createCategory({ name: newCategory.trim() });
      setNewCategory("");
      setSuccess("Category created successfully!");
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error creating category", err);
      setError(err.response?.data?.message || "Error creating category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await categoryService.deleteCategory(categoryId);
      setSuccess("Category deleted successfully!");
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error deleting category", err);
      setError(err.response?.data?.message || "Error deleting category");
    }
  };

  const handleAgentSelection = (categoryId, agentId) => {
    setSelectedAgents(prev => {
      const currentAgents = prev[categoryId] || [];
      const newAgents = currentAgents.includes(agentId)
        ? currentAgents.filter(id => id !== agentId)
        : [...currentAgents, agentId];
      
      return {
        ...prev,
        [categoryId]: newAgents
      };
    });
  };

  const handleAssignAgents = async (categoryId) => {
    try {
      setError("");
      setSuccess("");
      const agentIds = selectedAgents[categoryId] || [];
      await categoryService.assignAgentsToCategory(categoryId, agentIds);
      setSuccess("Agents assigned successfully!");
      fetchData(); // Refresh to show updated assignments
    } catch (err) {
      console.error("Error assigning agents", err);
      setError(err.response?.data?.message || "Error assigning agents");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Manage Categories</h2>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Add New Category */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new category"
          className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white w-full focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded text-white transition-colors"
        >
          Add
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No categories found. Create your first category above.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{category.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {category.assignedAgents?.length || 0} agent(s) assigned
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-500 hover:text-red-400 hover:underline transition-colors"
                >
                  Delete
                </button>
              </div>

              {/* Agent Assignment Section */}
              {agents.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white mb-2">Assign Agents:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                    {agents.map((agent) => (
                      <label key={agent._id} className="flex items-center text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(selectedAgents[category._id] || []).includes(agent._id)}
                          onChange={() => handleAgentSelection(category._id, agent._id)}
                          className="mr-2"
                        />
                        {agent.name} ({agent.email})
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAssignAgents(category._id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition-colors"
                  >
                    Update Assignment
                  </button>
                </div>
              )}

              {/* Currently Assigned Agents */}
              {category.assignedAgents && category.assignedAgents.length > 0 && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-white mb-2">Currently Assigned:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.assignedAgents.map((agent) => (
                      <span key={agent._id} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {agent.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageCategories;