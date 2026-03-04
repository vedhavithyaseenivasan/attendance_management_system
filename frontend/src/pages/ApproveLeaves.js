import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

const ApproveLeaves = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userRole = user?.role;

  useEffect(() => {
    const fetchTeamLeaves = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/leave/team-leaves",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        //Show APPLIED leaves
        const appliedLeaves = res.data.filter((l) => l.status === "APPLIED");
        setLeaves(appliedLeaves);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to fetch leaves",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamLeaves();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.put(
        `http://localhost:5000/api/leave/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //Remove leave from UI
      setLeaves((prev) => prev.filter((l) => l.id !== id));

      //Show confirmation Snackbar
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update leave",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
      </div>
    );

  if (!leaves.length)
    return (
      <Typography
        variant="h6"
        align="center"
        style={{ marginTop: "50px" }}
      >
        No applied leaves found.
      </Typography>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Leave Approvals
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead bgcolor="#007BFF">
            <TableRow>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>From</TableCell>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>To</TableCell>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Reason</TableCell>
  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
</TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((l) => (
              <TableRow key={l.id} hover>
                <TableCell>{l.User?.name}</TableCell>
                <TableCell>{new Date(l.from_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(l.to_date).toLocaleDateString()}</TableCell>
                <TableCell>{l.leave_type}</TableCell>
                <TableCell>{l.reason}</TableCell>
                <TableCell>
                  {(userRole === "LEAD" || userRole === "MANAGER") && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(l.id, "APPROVED")}
                        disabled={updatingId === l.id}
                        sx={{ mr: 4 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleStatusChange(l.id, "REJECTED")}
                        disabled={updatingId === l.id}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ApproveLeaves;