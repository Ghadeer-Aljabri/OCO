import { useState } from "react";
import { userSchemaValidation } from "../Validations/UserValidation";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Features/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { resetSuccess } from "../Features/UserSlice";
import logo from "../Images/Logo_transparent.png";
import oco from "../Images/oco.jpeg";
import { useTranslation } from "react-i18next"; // Add translation hook


const Register = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [civilId, setCivilId] = useState(null);
  const [phoneNo, setPhoneNo] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [socialStatus, setSocialStatus] = useState("");
  const [address, setAddress] = useState("");
  const [employment, setEmployment] = useState("");
  const [salary, setSalary] = useState(null);
  const [governorate, setGovernorate] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  const dispatch = useDispatch();
  const msg = useSelector((state) => state.user.message);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const handleSubmit = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      dob: dob,
      civilId: civilId,
      phoneNo: phoneNo,
      dateIssued: dateIssued,
      socialStatus: socialStatus,
      address: address,
      employment: employment,
      salary: salary,
      governorate: governorate,
    };
    console.log("the user", user);

    dispatch(addUser(user));
  };
  const today = new Date();
  const minDOB = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  useEffect(() => {
    if (msg === "User Added..") {
      setLoadingMessage(t("register.Redirecting you to login page..."));
  
      setTimeout(() => {
        console.log("User registered successfully!");
        navigate("/");
        dispatch(resetSuccess());
      }, 2000);
    }
  
    if (msg === "User Exists..") {
      console.warn(t("register.This email is already registered."));
      setLoadingMessage(t("register.This email already exists. Please use a different one."));
    }
  
    if (isError) {
      console.error(t("register.Registration failed due to server error."));
      setLoadingMessage(t("register.Something went wrong. Please try again later."));
    }
  }, [msg, isError, navigate, dispatch, t]);
  

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundImage: `url(${oco})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Container fluid className="form-container">
          <Row className="div-row">
            <Col className="div-col" lg="6">
              <form className="div-form">
                <Row className="justify-content-center text-center mb-4">
                  <h4
                    className="mb-3"
                    style={{
                      fontSize: "1.6rem",
                      color: "#2e7d32",
                      marginBottom: "20px",
                      textAlign: "center",
                      letterSpacing: "1px",
                    }}
                  >
                    {t("register.Become a Sponsor")}
                  </h4>
                  <Col lg="4">
                    <img
                      src={logo}
                      alt="Logo"
                      className="mb-3"
                      style={{ maxWidth: "150px" }}
                    />
                  </Col>
                </Row>
                <section className="form">
                  <FormGroup>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder={t("register.Enter your full name...")}
                      {...register("name", {
                        value: name,
                        onChange: (e) => setName(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.name?.message}</p>
  
                  <FormGroup>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder={t("register.Enter your email...")}
                      {...register("email", {
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.email?.message}</p>
  
                  <FormGroup>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder={t("register.Enter your password...")}
                      {...register("password", {
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.password?.message}</p>
  
                  <FormGroup>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder={t("register.Confirm your new password")}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="error">{errors.confirmPassword.message}</p>
                    )}
                  </FormGroup>
  
                  <FormGroup>
                    <Label for="dob">{t("register.Date of Birth")}</Label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder={t("register.Date of Birth")}
                      {...register("dob", {
                        value: dob,
                        onChange: (e) => setDob(e.target.value),
                      })}
                      max={minDOB.toISOString().split("T")[0]} // Restricts the calendar
                    />
                  </FormGroup>
                  <p className="error">{errors.dob?.message}</p>
  
                  <FormGroup>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("register.Civil ID")}
                      {...register("civilId", {
                        value: civilId,
                        onChange: (e) => setCivilId(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.civilId?.message}</p>
  
                  <FormGroup>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("register.Phone Number")}
                      {...register("phoneNo", {
                        value: phoneNo,
                        onChange: (e) => setPhoneNo(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.phoneNo?.message}</p>
                  <Label for="DateIssued">{t("register.Date Issued")}</Label>
  
                  <FormGroup>
                    <input
                      type="date"
                      className="form-control"
                      placeholder={t("register.Date Issued")}
                      {...register("dateIssued", {
                        value: dateIssued,
                        onChange: (e) => setDateIssued(e.target.value),
                      })}
                    />
                  </FormGroup>
                  <p className="error">{errors.dateIssued?.message}</p>
  
                  <FormGroup>
                    <select
                      className="form-control"
                      id="socialStatus"
                      {...register("socialStatus", {
                        value: socialStatus,
                        onChange: (e) => setSocialStatus(e.target.value),
                      })}
                    >
                      <option value="">{t("register.Select Social Status")}</option>
                      <option value="single">{t("register.Single")}</option>
                      <option value="married">{t("register.Married")}</option>
                      <option value="divorced">{t("register.Divorced")}</option>
                      <option value="widowed">{t("register.Widowed")}</option>
                    </select>
                  </FormGroup>
                  <p className="error">{errors.socialStatus?.message}</p>
  
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("register.Address")}
                          {...register("address", {
                            value: address,
                            onChange: (e) => setAddress(e.target.value),
                          })}
                        />
                      </FormGroup>
                      <p className="error">{errors.address?.message}</p>
                    </Col>
  
                    <Col md="6">
                      <FormGroup>
                        <select
                          type="select"
                          className="form-control"
                          {...register("governorate", {
                            value: governorate, // Update state if needed
                            onChange: (e) => setGovernorate(e.target.value),
                          })}
                        >
                          <option value="">{t("register.Select Governorate")}</option>
                          <option value="Muscat">{t("register.Muscat")}</option>
                          <option value="Al Batinah North">{t("register.Al Batinah North")}</option>
                          <option value="Al Batinah South">{t("register.Al Batinah South")}</option>
                          <option value="Al Dakhiliyah">{t("register.Al Dakhiliyah")}</option>
                          <option value="Al Dhahirah">{t("register.Al Dhahirah")}</option>
                          <option value="Al Sharqiyah North">{t("register.Al Sharqiyah North")}</option>
                          <option value="Al Sharqiyah South">{t("register.Al Sharqiyah South")}</option>
                          <option value="Dhofar">{t("register.Dhofar")}</option>
                          <option value="Al Wusta">{t("register.Al Wusta")}</option>
                          <option value="Musandam">{t("register.Musandam")}</option>
                          <option value="Al Buraimi">{t("register.Al Buraimi")}</option>
                        </select>
                      </FormGroup>
                      <p className="error">{errors.governorate?.message}</p>
                    </Col>
                  </Row>
  
                  {/* Employment Status */}
                  <FormGroup>
                    <Label>{t("register.Employment Status")}</Label>
                    <div>
                      <input
                        type="radio"
                        id="employed"
                        value="employed"
                        {...register("employment", {
                          value: employment,
                          onChange: (e) => setEmployment(e.target.value),
                        })}
                        checked={employment === "employed"}
                      />
                      <Label for="employed" style={{ marginLeft: "5px" }}>
                        {t("register.Employed")}
                      </Label>
                    </div>
  
                    <div>
                      <input
                        type="radio"
                        id="notEmployed"
                        value="not employed"
                        {...register("employment", {
                          value: employment,
                          onChange: (e) => setEmployment(e.target.value),
                        })}
                        checked={employment === "not employed"}
                      />
                      <Label for="notEmployed" style={{ marginLeft: "5px" }}>
                        {t("register.Not Employed")}
                      </Label>
                    </div>
                  </FormGroup>
                  <p className="error">{errors.employment?.message}</p>
  
                  {employment === "employed" && (
                    <FormGroup>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("register.Monthly Income")}
                        {...register("salary", {
                          value: salary,
                          onChange: (e) => setSalary(e.target.value),
                        })}
                      />
                      <p className="error">{errors.salary?.message}</p>
                    </FormGroup>
                  )}
  
                  <Button
                    color="primary"
                    className="form-control"
                    onClick={submitForm(handleSubmit)}
                  >
                    {t("register.REGISTER")}
                  </Button>
                  {loadingMessage && (
                    <h3 className="text-center text-lg">{loadingMessage}</h3>
                  )}
                  <FormGroup>
                    <Label>
                      {t("register.Already Have an Account?")} <Link to="/login">{t("register.Sign In")}</Link>
                    </Label>
                  </FormGroup>
                </section>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
  
};

export default Register;
