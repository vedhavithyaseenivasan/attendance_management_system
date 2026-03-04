import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 220;

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) return null;

  let menuItems = [];

  //COMMON
  menuItems.push({ name: "My Profile", path: "/dashboard" });
  menuItems.push({ name: "My Attendance", path: "/myattendance" });
  menuItems.push({ name: "Holidays", path: "/holiday" });

  //TEAM_MEMBER & LEAD
  if (user.role === "TEAM_MEMBER" || user.role === "LEAD") {
    menuItems.push({ name: "Apply for Leave", path: "/leave/apply" });
    menuItems.push({ name: "Applied Leaves", path: "/leave/my-leaves" });
  }

  //LEAD & MANAGER
  if (user.role === "LEAD" || user.role === "MANAGER") {
    menuItems.push({ name: "Approve Leave", path: "/leave/approve" });
    menuItems.push({ name: "Team Attendance", path: "/team-attendance" });
  }
  
  //HR
  if (user.role === "HR") {
    menuItems.push({ name: "Users", path: "/users" });
    menuItems.push({ name: "Mark Attendance", path: "/attendance" });
    menuItems.push({name:"Update Attendance", path: "/update-attendance"});
    menuItems.push({ name: "Add Holiday", path: "/holiday/add" });
    menuItems.push({ name: "Team Attendance", path: "/team-attendance" });
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