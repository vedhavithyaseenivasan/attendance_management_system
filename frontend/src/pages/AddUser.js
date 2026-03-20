import React, { useState } from "react";
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

const AddUser = () => {
  const [formData, setFormData] = useState({
    employee_code: "",
    name: "",
    email: "",
    password: "",
    role: "",
    team_id: "",
    reporting_to: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  if (
    !formData.employee_code ||
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.role
  ) {
    setMessage("Please fill all required fields");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (!token) {
      setMessage("User not logged in. Please login again.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      team_id: formData.team_id ? Number(formData.team_id) : null,
      reporting_to: formData.reporting_to
        ? Number(formData.reporting_to)
        : null,
    };

    const res = await axios.post(
      "http://localhost:5000/api/users/create",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessage(res.data.message || "User created successfully");

    setFormData({
      employee_code: "",
      name: "",
      email: "",
      password: "",
      role: "",
      team_id: "",
      reporting_to: "",
      status: "ACTIVE",
    });

  } catch (err) {
    console.error("ERROR:", err);
    setMessage(err.response?.data?.message || "Failed to create user");
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
          Add User
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        <TextField
          label="Employee Code"
          name="employee_code"
          value={formData.employee_code}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="LEAD">Lead</MenuItem>
            <MenuItem value="TEAM_MEMBER">Team Member</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Team ID"
          name="team_id"
          value={formData.team_id}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <TextField
          label="Reporting To (User ID)"
          name="reporting_to"
          value={formData.reporting_to}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

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
          {loading ? <CircularProgress size={24} /> : "Create User"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddUser;