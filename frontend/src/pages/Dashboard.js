import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const {Status} = require("../constant/constant");

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

  const getStatusColor = (status) => {
    if (status === Status.ACTIVE) return "success";
    if (status === Status.INACTIVE) return "error";
    return "warning";
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography
         variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" ,ml:6}}
      >
        My Profile
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 4,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <CardContent sx={{ p: 4 }}>

          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 75,
                  height: 75,
                  fontSize: 30,
                  bgcolor: "primary.main",
                  boxShadow: 3,
                }}
              >
                {user.name?.charAt(0)}
              </Avatar>
            </Grid>

            <Grid item xs>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Grid>

            <Grid item>
              <Chip
                label={user.status}
                color={getStatusColor(user.status)}
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Employee Details
          </Typography>

          <Table
            size="small"
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0px 20px", 
            }}
          >
            <TableBody>

              <TableRow
                sx={{
                  backgroundColor: "#f9fafc",
                  boxShadow: 1,
                  "& td": { border: 0 },
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#f1f5f9" },
                }}
              >
                <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                  Employee Code
                </TableCell>
                <TableCell>{user.employee_code}</TableCell>
              </TableRow>

              <TableRow
                sx={{
                  backgroundColor: "#f9fafc",
                  boxShadow: 1,
                  "& td": { border: 0 },
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#f1f5f9" },
                }}
              >
                <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                  Employee Name
                </TableCell>
                <TableCell>{user.name}</TableCell>
              </TableRow>

              <TableRow
                sx={{
                  backgroundColor: "#f9fafc",
                  boxShadow: 1,
                  "& td": { border: 0 },
                  "&:hover": { backgroundColor: "#f1f5f9" },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>
                  Role
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color="primary"
                    size="small"
                  />
                </TableCell>
              </TableRow>

              {user.role !== "HR" && (
                <TableRow
                  sx={{
                    backgroundColor: "#f9fafc",
                    boxShadow: 1,
                    "& td": { border: 0 },
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>
                    Team ID
                  </TableCell>
                  <TableCell>{user.team_id}</TableCell>
                </TableRow>
              )}

              <TableRow
                sx={{
                  backgroundColor: "#f9fafc",
                  boxShadow: 1,
                  "& td": { border: 0 },
                  "&:hover": { backgroundColor: "#f1f5f9" },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>
                  Email
                </TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>

            </TableBody>
          </Table>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
