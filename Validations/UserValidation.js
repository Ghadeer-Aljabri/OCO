import * as yup from "yup"; // Import all from yup

const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com","hotmail.com"]; 

// Calculate the minimum allowed date (18 years ago)
const today = new Date();
const minDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

export const userSchemaValidation = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name should only contain alphabetic characters.")
    .required("Please provide your full name."),
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email address is required.")
    .test(
      "valid-domain",
      "Enter a valid email address.",
      (value) => {
        if (!value) return false;
        const domain = value.split("@")[1];
        return allowedDomains.includes(domain);
      }
    ),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(20, "Password cannot exceed 20 characters.")
    .matches(/[A-Za-z]/, "Password must contain at least one letter.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[\W_]/, "Password must contain at least one special character (!@#$%^&* etc.)")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match. Please try again.")
    .required("Please confirm your password."),

  // Validation for Date of Birth (Must be at least 18 years old)
  dob: yup
    .date()
    .typeError("Choose a valid Date.")  
    .required("Date of birth is required.")
    .max(minDOB, "You must be at least 18 years old."), // Ensures the user is 18+

  // Validation for Civil ID (assuming it should be numeric and a valid length)
  civilId: yup
    .string()
    .matches(/^[0-9]{1,10}$/, "Civil ID should be up to 10 digits.")
    .required("Civil ID is required."),

  // Validation for Phone Number
  phoneNo: yup
  .string()
  .matches(/^[97][0-9]{7}$/, "Phone number should start with 9 or 7 and be 8 digits long.")
  .required("Phone number is required."),

  // Validation for Date Issued (Date format)
  dateIssued: yup
    .date()
    .typeError("Choose a valid Date.")  
    .required("Date issued is required.")
    .max(new Date(), "Date issued cannot be in the future."),

  // Validation for Social Status
  socialStatus: yup
    .string()
    .required("Social status is required.")
    .oneOf(["single", "married", "divorced", "widowed"], "Please select a valid social status."),

  // Validation for Address
  address: yup
    .string()
    .min(6, "Address must be at least 6 characters long.")
    .required("Address is required."),

  // Validation for Employment Status
  employment: yup
    .string()
    .oneOf(["employed", "not employed"], "Employment status must be either 'employed' or 'not employed'.")
    .required("Employment status is required."),

  // Validation for Salary (if applicable)
  salary: yup
    .number()
    .typeError("Salary should be a valid number.")  
    .min(0, "Salary must be a positive number.")    
    .required("Salary is required."),    
    governorate: yup
    .string()
    .required("Governorate is required.")
    .oneOf(
      [
        "Muscat",
        "Al Batinah North",
        "Al Batinah South",
        "Al Dakhiliyah",
        "Al Dhahirah",
        "Al Sharqiyah North",
        "Al Sharqiyah South",
        "Dhofar",
        "Al Wusta",
        "Musandam",
        "Al Buraimi",
      ],
      "Please select a valid governorate."
    ),
           
});
