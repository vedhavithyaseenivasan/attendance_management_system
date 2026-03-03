import axiosInstance from "../../api/axiosInstance";

export const fetchAttendanceAPI = async () => {
  try {
    const response = await axiosInstance.get("/attendance");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch attendance";
  }
};