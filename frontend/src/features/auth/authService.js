import axiosInstance from "../../api/axiosInstance";

//Login API
export const loginAPI = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data.data;
};

//Logout API
export const logoutAPI = () => {
  localStorage.removeItem("token");
};