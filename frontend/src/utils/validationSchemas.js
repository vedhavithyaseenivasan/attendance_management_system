import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const leaveSchema = yup.object().shape({
  fromDate: yup.date().required("From date required"),
  toDate: yup.date().required("To date required"),
  reason: yup.string().min(5).required("Reason required"),
});