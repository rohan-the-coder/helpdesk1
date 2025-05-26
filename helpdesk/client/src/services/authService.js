import axios from "../utils/axios";

const login = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  console.log("Login API response:", response.data); // for debugging
  return response.data; // should be { user, token }
};

const register = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
