// src/Validations/ProfileValidation.js
import * as yup from "yup";

export const profileSchemaValidation = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  phoneNo: yup
    .string()
    .matches(/^[0-9]{8}$/, "Phone number must be 8 digits")
    .nullable()
    .required(),
nickname: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Nickname can only contain letters")

    
});
