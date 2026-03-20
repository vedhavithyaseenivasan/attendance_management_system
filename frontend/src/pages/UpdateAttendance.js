import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
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

const UpdateAttendance = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.data || res.data); // handle different response structures
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
        check_in_time: status === "PRESENT" ? checkInTime : null,
        check_out_time: status === "PRESENT" ? checkOutTime : null,
      };

      const res = await axios.put(
        "http://localhost:5000/api/attendance/update", // call update endpoint
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Attendance updated successfully");

      //Reset form
      setSelectedUser("");
      setDate("");
      setStatus("PRESENT");
      setCheckInTime("");
      setCheckOutTime("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleChange=(e)=>{
    const formattedVal=moment(e.target.value,'HH:mm').format('HH:mm:ss');
    setCheckInTime(formattedVal)
  }

  const handleChange2=(e)=>{
    const formattedVal=moment(e.target.value,'HH:mm').format('HH:mm:ss');
    setCheckOutTime(formattedVal)
  }

  return (
    <Box
      p={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="#ffffff"
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
          Update Attendance
        </Typography>

        {message && (
          <Alert
            severity={message.includes("failed") ? "error" : "success"}
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* User Dropdown */}
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

        {/* Date */}
        <TextField
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        {/* Status */}
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

        {/* Only show check-in/out when Present */}
        {status === "PRESENT" && (
          <>
            <TextField
              type="time"
              label="Check-in Time"
              value={checkInTime}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 3 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="Check-out Time"
              value={checkOutTime}
              onChange={handleChange2}
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
          {loading ? <CircularProgress size={24} /> : "Update Attendance"}
        </Button>
      </Paper>
    </Box>
  );
};

export default UpdateAttendance;