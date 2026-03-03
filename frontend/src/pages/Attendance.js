import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../features/attendance/attendanceSlice";
import moment from "moment";
import { Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";

const Attendance = () => {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {records.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.user.name}</TableCell>
            <TableCell>
              {moment(item.date).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Attendance;