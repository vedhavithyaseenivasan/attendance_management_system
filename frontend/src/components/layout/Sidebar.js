import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const {Roles} = require("../../constant/constant");

const drawerWidth = 220;

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) return null;

  let menuItems = [];
  
  //TEAM_MEMBER
  if(user.role === Roles.TEAM_MEMBER)
  {
    menuItems.push({ name: "My Profile", path: "/dashboard" });
    menuItems.push({ name: "My Attendance", path: "/myattendance" });
    menuItems.push({ name: "Apply for Leave", path: "/leave/apply" });
    menuItems.push({ name: "Applied Leaves", path: "/leave/my-leaves" });
    menuItems.push({ name: "Holidays", path: "/holiday" });
  }

  //LEAD
  if(user.role === Roles.LEAD)
  {
    menuItems.push({ name: "My Profile", path: "/dashboard" });
    menuItems.push({ name: "My Attendance", path: "/myattendance" });
    menuItems.push({ name: "Team Attendance", path: "/team-attendance" });
    menuItems.push({ name: "Apply for Leave", path: "/leave/apply" });
    menuItems.push({ name: "Applied Leaves", path: "/leave/my-leaves" });
    menuItems.push({ name: "Approve Leave", path: "/leave/approve" });
    menuItems.push({ name: "Holidays", path: "/holiday" });
  }

  //MANAGER
  if(user.role === Roles.MANAGER)
  {
    menuItems.push({ name: "My Profile", path: "/dashboard" });
    menuItems.push({ name: "My Attendance", path: "/myattendance" });
    menuItems.push({ name: "Team Attendance", path: "/team-attendance" });
    menuItems.push({ name: "Approve Leave", path: "/leave/approve" });
    menuItems.push({ name: "Holidays", path: "/holiday" });
  }

  //HR
  if(user.role === Roles.HR)
  {
    menuItems.push({ name: "My Profile", path: "/dashboard" });
    menuItems.push({ name: "My Attendance", path: "/myattendance" });
    menuItems.push({ name: "Team Attendance", path: "/team-attendance" });
    menuItems.push({ name: "Mark Attendance", path: "/attendance" });
    menuItems.push({ name: "Update Attendance", path: "/update-attendance"});
    menuItems.push({ name: "Add Holiday", path: "/holiday/add" });
    menuItems.push({ name: "Holidays", path: "/holiday" });
    menuItems.push({ name: "Users", path: "/users" });
    menuItems.push({ name: "Add User", path: "/users/create" });
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      
      <Typography
        variant="h6"
        align="left"
        sx={{ mt: 2,ml: 2, fontWeight: "bold", color: "#1976d2" }}
      >
        MENU
      </Typography>
      <Divider /> 

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.name}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;