import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";

const MarkAttendance = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser || !date || !status) {
      setMessage("Please fill all required fields");
      return;
    }

    if (status === "PRESENT" && (!checkInTime || !checkOutTime)) {
      setMessage("Please provide check-in and check-out times for Present status");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        user_id: selectedUser,
        date,
        status,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
      };

      const res = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Attendance marked successfully");

      setSelectedUser("");
      setDate("");
      setStatus("PRESENT");
      setCheckInTime("");
      setCheckOutTime("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="#f9f9f9"
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Mark Attendance
        </Typography>

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="User"
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="PRESENT">Present</MenuItem>
            <MenuItem value="ABSENT">Absent</MenuItem>
          </Select>
        </FormControl>
        
        {status === "PRESENT" && (
          <>
            <TextField
              type="time"
              label="Check-in Time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="Check-out Time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Mark Attendance"}
        </Button>
      </Paper>
    </Box>
  );
};

export default MarkAttendance;