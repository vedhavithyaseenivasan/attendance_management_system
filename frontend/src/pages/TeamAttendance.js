import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";

const TeamAttendance = () => {
  const [records, setRecords] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const years = [];
  for (let y = 2026; y >= 2018; y--) years.push(y);

  //Fetch attendance
  useEffect(() => {
    const fetchTeamAttendance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/attendance?month=${month}&year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        if (searchName.trim() !== "") {
          data = data.filter((r) =>
            r.User?.name
              ?.toLowerCase()
              .includes(searchName.toLowerCase())
          );
        }

        setRecords(data);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAttendance();
  }, [month, year, searchName]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PRESENT":
        return { backgroundColor: "#D4EDDA", color: "#155724", padding: "4px 10px", borderRadius: 8, fontWeight: 600 };
      case "ABSENT":
        return { backgroundColor: "#F8D7DA", color: "#721C24", padding: "4px 10px", borderRadius: 8, fontWeight: 600 };
      case "LATE":
        return { backgroundColor: "#FFF3CD", color: "#856404", padding: "4px 10px", borderRadius: 8, fontWeight: 600 };
      case "HALF_DAY":
        return { backgroundColor: "#CCE5FF", color: "#004085", padding: "4px 10px", borderRadius: 8, fontWeight: 600 };
      default:
        return { backgroundColor: "#E2E3E5", color: "#383D41", padding: "4px 10px", borderRadius: 8, fontWeight: 600 };
    }
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 950,
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
          Team Attendance
        </Typography>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search by Employee Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ minWidth: 250 }}
          />
        </Box>

        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : records.length === 0 ? (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            No attendance records found.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto", borderRadius: 2 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                }}
              >
                <tr>
                  <th style={{ padding: "10px" }}>Employee</th>
                  <th style={{ padding: "10px" }}>Role</th>
                  <th style={{ padding: "10px" }}>Date</th>
                  <th style={{ padding: "10px" }}>Check In</th>
                  <th style={{ padding: "10px" }}>Check Out</th>
                  <th style={{ padding: "10px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={`${r.id}-${r.date}`}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "10px" }}>
                      {r.User?.name || "Unknown"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {r.User?.role || "Unknown"}
                    </td>
                    <td style={{ padding: "10px" }}>{r.date}</td>
                    <td style={{ padding: "10px" }}>
                      {r.check_in_time || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {r.check_out_time || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span style={getStatusStyle(r.status)}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TeamAttendance;