import * as yup from 'yup';

export const LoginValidation = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email address.")
        .required("Email is required."),
    password: yup
        .string()
        .max(20, "Password cannot exceed 20 characters.") // Corrected to 20 characters as per the error message
        .required("Password is required."),
});
