import * as Yup from "yup";

export const passwordSchemaValidation = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(6, "Password must be at least 6 characters"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Za-z]/, "Password must contain at least one letter.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[\W_]/, "Password must contain at least one special character (!@#$%^&* etc.)")
    .notOneOf([Yup.ref("currentPassword")], "New password cannot be the same as the current password"),
  confirmPassword: Yup.string()
    .required("Confirm your new password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
