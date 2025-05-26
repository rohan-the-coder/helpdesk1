import axios from "../utils/axios";

const getCategories = async () => {
  const response = await axios.get("/admin/categories");
  return response.data;
};

const createCategory = async (category) => {
  const response = await axios.post("/admin/categories", category);
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await axios.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

const categoryService = {
  getCategories,
  createCategory,
  deleteCategory,
};

export default categoryService;
