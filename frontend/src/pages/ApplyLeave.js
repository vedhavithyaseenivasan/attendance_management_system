import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";

const ApplyLeave = () => {
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    leave_type: "FULL_DAY",
    half_day_type: "",
    reason: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/leave/apply",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({ open: true, message: response.data.message, severity: "success" });

      setFormData({
        from_date: "",
        to_date: "",
        leave_type: "FULL_DAY",
        half_day_type: "",
        reason: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    }
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Apply Leave
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            name="from_date"
            value={formData.from_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="To Date"
            type="date"
            name="to_date"
            value={formData.to_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
          />

          <TextField
            select
            fullWidth
            label="Leave Type"
            name="leave_type"
            value={formData.leave_type}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="FULL_DAY">Full Day</MenuItem>
            <MenuItem value="HALF_DAY">Half Day</MenuItem>
          </TextField>

          {formData.leave_type === "HALF_DAY" && (
            <TextField
              select
              fullWidth
              label="Half Day Type"
              name="half_day_type"
              value={formData.half_day_type}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="FIRST_HALF">First Half</MenuItem>
              <MenuItem value="SECOND_HALF">Second Half</MenuItem>
            </TextField>
          )}

          <TextField
            fullWidth
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontWeight: "bold", fontSize: "16px" }}
          >
            Apply Leave
          </Button>
        </form>

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
      </Paper>
    </Box>
  );
};

export default ApplyLeave;