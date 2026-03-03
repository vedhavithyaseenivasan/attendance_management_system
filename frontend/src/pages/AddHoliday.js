import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";

const AddHoliday = () => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("GOVERNMENT");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !name || !type) {
      setSnackbar({ open: true, message: "All fields are required", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/holiday/add",
        { date, name, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: res.data.message || "Holiday added successfully", severity: "success" });

      // Reset form
      setDate("");
      setName("");
      setType("GOVERNMENT");
    } catch (err) {
      console.error("Add holiday error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to add holiday", severity: "error" });
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
          Add Holiday
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Holiday Date"
            type="date"
            fullWidth
            margin="normal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Holiday Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Holiday Type"
            select
            fullWidth
            margin="normal"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="GOVERNMENT">Government</MenuItem>
            <MenuItem value="WEEKEND">Weekend</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", fontSize: "16px" }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Holiday"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddHoliday;