import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Fetch leaves from backend
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/leave/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setSnackbar({ open: true, message: "Failed to fetch leaves", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Delete leave
  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/leave/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted leave from state
      setLeaves((prev) => prev.filter((leave) => leave.id !== leaveId));

      // Show success message
      setSnackbar({ open: true, message: "Leave deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting leave:", error);
      const message = error.response?.data?.message || "Failed to delete leave";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  // Status chip colors
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
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
                  </Box>

                  {/* Delete button only for APPLIED leaves */}
                  {leave.status === "APPLIED" && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(leave.id)}
                      sx={{ ml: 2 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default MyLeaves; 