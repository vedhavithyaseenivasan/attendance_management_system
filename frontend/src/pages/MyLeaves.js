import React, { useEffect, useState, useCallback } from "react";
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  // FETCH LEAVES
  const fetchLeaves = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/leave/my-leaves",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const leavesData = response?.data?.data || [];

      setLeaves(leavesData);
    } catch (error) {
      console.error("Error fetching leaves:", error);

      setSnackbar({
        open: true,
        message: "Failed to fetch leaves",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

    useEffect(() => {
      fetchLeaves();

      const interval = setInterval(() => {
        fetchLeaves();
      }, 5000);

      return () => clearInterval(interval);

    }, [fetchLeaves]);

  // DELETE LEAVE
  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/leave/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaves((prevLeaves) =>
        prevLeaves.filter((leave) => leave.id !== leaveId)
      );

      setSnackbar({
        open: true,
        message: "Leave deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting leave:", error);

      const message =
        error.response?.data?.message || "Failed to delete leave";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };

  // STATUS COLOR
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
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 700,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
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
            {Array.isArray(leaves) &&
              leaves.map((leave) => {
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
                      <Typography>
                        <strong>From:</strong> {leave.from_date}
                      </Typography>

                      <Typography>
                        <strong>To:</strong> {leave.to_date}
                      </Typography>

                      <Typography>
                        <strong>Type:</strong> {leave.leave_type}
                      </Typography>

                      {leave.leave_type === "HALF_DAY" && (
                        <Typography>
                          <strong>Half Day:</strong> {leave.half_day_type}
                        </Typography>
                      )}

                      <Typography>
                        <strong>Reason:</strong> {leave.reason}
                      </Typography>

                      <Chip
                        label={statusChip.label}
                        color={statusChip.color}
                        sx={{ mt: 1, fontWeight: "bold" }}
                      />
                    </Box>

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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={() =>
              setSnackbar((prev) => ({ ...prev, open: false }))
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default MyLeaves;