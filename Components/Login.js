import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  FormGroup,
  Row,
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { LoginValidation } from "../Validations/LoginValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Features/UserSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetSuccess } from "../Features/UserSlice";
import logo from "../Images/Logo_transparent.png";
import oco from "../Images/oco.jpeg";
import { useTranslation } from "react-i18next"; // Add this import

function Login() {
  const { t } = useTranslation(); // Initialize the translation function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let user = useSelector((state) => state.user.userInfo);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);
  const loginError = useSelector((state) => state.user.loginError);
  let isMounted = true; // ✅ Track component mounting

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginValidation),
  });

  const handleLogin = (data) => {
    const userData = { email: data.email, password: data.password };
    dispatch(getUser(userData)); // Dispatch login action
    console.log(isSuccess);
    console.log(isError);
  };

  useEffect(() => {
    if (isSuccess && user && isMounted) {
      console.log("Login successful!");
      navigate("/home");
      dispatch(resetSuccess());
    }
    if (isError && isMounted) {
      console.error("Login failed");
    }
    return () => {
      isMounted = false; // ✅ Cleanup function to prevent memory leaks
    };
  }, [isSuccess, isError, navigate, dispatch, user]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background Image with Opacity */}
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
            <Col className="div-col" md="6">
              <form className="div-form" onSubmit={handleSubmit(handleLogin)}>
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
                    {t("login.sponsorshipProgram")} {/* Use the translation here */}
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
                <FormGroup className="form-items">
                  <Label>{t("login.email")}</Label> {/* Translation for Email */}
                  <input
                    type="email"
                    className="form-control"
                    {...register("email", {
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                    })}
                  />
                  <p className="error">{errors.email?.message}</p>
                </FormGroup>
                <FormGroup className="form-items">
                  <Label>{t("login.password")}</Label> {/* Translation for Password */}
                  <InputGroup>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      {...register("password", {
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                      })}
                    />
                    <InputGroupText
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </InputGroupText>
                  </InputGroup>
                  <p className="error">{errors.password?.message}</p>
                </FormGroup>

                {loginError && <p className="error">{loginError}</p>}

                <FormGroup className="form-items">
                  <Input type="checkbox" className="form-control" />
                  <Label>{t("login.rememberMe")}</Label> {/* Remember Me Translation */}
                </FormGroup>
                <FormGroup className="form-items">
                  <Label>
                    <Link to="/forget">{t("login.forgotPassword")}</Link> {/* Forgot Password Translation */}
                  </Label>
                </FormGroup>
                <FormGroup className="form-items">
                  <Button
                    color="primary"
                    className="form-control"
                    type="submit" // Use submit type here
                  >
                    {t("login.signIn")} {/* Sign In Button Translation */}
                  </Button>
                </FormGroup>
                <FormGroup className="form-items">
                  <Label>
                    {t("login.noAccount")} <Link to="/register">{t("login.signUpNow")}</Link> {/* Sign Up Link */}
                  </Label>
                </FormGroup>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Login;
