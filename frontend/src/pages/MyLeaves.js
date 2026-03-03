import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/leave/my-leaves",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return { label: "Applied", color: "warning" };
      case "APPROVED":
        return { label: "Approved", color: "success" };
      case "REJECTED":
        return { label: "Rejected", color: "error" };
      default:
        return { label: status, color: "default" };
    }
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 700, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          My Applied Leaves
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : leaves.length === 0 ? (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            No leaves applied yet
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {leaves.map((leave) => {
              const statusChip = getStatusColor(leave.status);
              return (
                <Paper
                  key={leave.id}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography><strong>From:</strong> {leave.from_date}</Typography>
                  <Typography><strong>To:</strong> {leave.to_date}</Typography>
                  <Typography><strong>Type:</strong> {leave.leave_type}</Typography>
                  {leave.leave_type === "HALF_DAY" && (
                    <Typography><strong>Half Day:</strong> {leave.half_day_type}</Typography>
                  )}
                  <Typography><strong>Reason:</strong> {leave.reason}</Typography>
                  <Chip
                    label={statusChip.label}
                    color={statusChip.color}
                    sx={{ mt: 1, fontWeight: "bold" }}
                  />
                </Paper>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MyLeaves;