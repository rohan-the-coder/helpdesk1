import axios from "../utils/axios";

const getAllUsers = async () => {
  const response = await axios.get("/admin/users");
  return response.data;
};

const updateUserRole = async (userId, role) => {
  const response = await axios.patch(`/admin/users/${userId}`, { role });
  return response.data;
};

const userService = {
  getAllUsers,
  updateUserRole,
};

export default userService;
