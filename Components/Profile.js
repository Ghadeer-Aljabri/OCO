import { useState } from "react";
import { Container, Button, FormGroup, Input, Label, Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchemaValidation } from "../Validations/PasswordValidation";
import { profileSchemaValidation } from "../Validations/ProfileValidation";
import { updatePassword, updateUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Account.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userInfo);
  const message = useSelector((state) => state.user.message);
  const error = useSelector((state) => state.user.updateError);
  const isLoading = useSelector((state) => state.user.isLoading);

  const [email, setEmail] = useState(user?.email || "");
  const [emailEditable, setEmailEditable] = useState(false);
  const [phone, setPhone] = useState(user?.phoneNo || "");
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [nicknameEditable, setNicknameEditable] = useState(false);
  const [phoneEditable, setPhoneEditable] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  console.log("User info from Redux:", user);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchemaValidation),
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    getValues,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchemaValidation),
    defaultValues: {
      email: user?.email || "",
      phoneNo: user?.phoneNo || "",
      nickname: user?.nickname || "",
    },
  });

  const handlePasswordUpdate = (data) => {
    setPasswordUpdating(true);
    dispatch(updatePassword({ ...data, email })).finally(() =>
      setPasswordUpdating(false)
    );
  };

  const handleProfileUpdate = (data) => {
    setProfileSaving(true);
    setErrorMessage(""); // Clear previous error

    const updatedUser = {
      ...user,
      email: data.email,
      phoneNo: data.phoneNo,
      nickname: data.nickname,
    };

    console.log("Updated user object: ", updatedUser);

    dispatch(updateUser(updatedUser))
      .then((response) => {
        console.log("Update response:", response);
        if (response.payload === "Email is already taken.") {
          setErrorMessage("That email is already in use.");
        } else {
          setSavedMessage("Saved...");
          setTimeout(() => setSavedMessage(""), 3000);
        }
      })
      .catch((error) => {
        console.error("Update failed:", error);
        setErrorMessage("Something went wrong. Try again.");
      })
      .finally(() => setProfileSaving(false));
  };

  return (
    <Container className="profile-container green-theme">
      <div className="profile-card">
        <div className="profile-header">
          <h3 className="mb-1">Profile Settings</h3>
        </div>

        {/* Profile Update Form */}
        <Form onSubmit={handleProfileSubmit(handleProfileUpdate)}>
          <div className="info-section">
            <div className="info-item">
              <Label>Full Name</Label>
              <div className="info-content">
                <span>{user?.name}</span>
              </div>
            </div>

            {/* Nickname Section */}
            <div className="info-item">
              <Label>Nickname</Label>
              <div className="info-content">
                {!nicknameEditable ? (
                  <span>{getValues("nickname")}</span>
                ) : (
                  <>
                    <input
                      type="text"
                      className="mt-2"
                      {...registerProfile("nickname")}
                    />
                    {profileErrors.nickname && (
                      <p className="text-danger">
                        {profileErrors.nickname.message}
                      </p>
                    )}
                  </>
                )}
                <Button
                  size="sm"
                  color="success"
                  type="button"
                  onClick={() => setNicknameEditable(!nicknameEditable)}
                >
                  {nicknameEditable ? "Cancel" : "Edit"}
                </Button>
              </div>
            </div>

            {/* Email Section */}
            <div className="info-item">
              <Label>Email</Label>
              <div className="info-content">
                <span>
                  {emailVisible ? getValues("email") : "********@****.com"}
                </span>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setEmailVisible(!emailVisible)}
                  >
                    Reveal
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setEmailEditable(!emailEditable)}
                  >
                    {emailEditable ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </div>
              {emailEditable && (
                <>
                  <input
                    type="email"
                    className="mt-2"
                    {...registerProfile("email")}
                  />
                  {profileErrors.email && (
                    <p className="text-danger">{profileErrors.email.message}</p>
                  )}
                </>
              )}
            </div>

            {/* Phone Number Section */}
            <div className="info-item">
              <Label>Phone Number</Label>
              <div className="info-content">
                <span>
                  {phoneVisible
                    ? getValues("phoneNo")
                    : getValues("phoneNo")
                    ? "*******" + getValues("phoneNo").slice(-4)
                    : ""}
                </span>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setPhoneVisible(!phoneVisible)}
                  >
                    Reveal
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setPhoneEditable(!phoneEditable)}
                  >
                    {phoneEditable ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </div>
              {phoneEditable && (
                <>
                  <input
                    type="text"
                    className="mt-2"
                    {...registerProfile("phoneNo")}
                  />
                  {profileErrors.phoneNo && (
                    <p className="text-danger">
                      {profileErrors.phoneNo.message}
                    </p>
                  )}
                </>
              )}
            </div>

            <Button  color="success" className="mt-3" type="submit" block>
              {profileSaving ? "Saving..." : "Save Changes"}
            </Button>
            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
            )}
            {savedMessage && (
              <p className="text-success mt-2">{savedMessage}</p>
            )}
            {message && <p className="text-success mt-2">{message}</p>}
          </div>
        </Form>

        {/* Password Change Section */}
        <div className="password-section mt-4">
          <h5 className="mb-3 text-success">Change Password</h5>

          <form onSubmit={handlePasswordSubmit(handlePasswordUpdate)}>
            <FormGroup>
              <Label for="currentPassword">Current Password</Label>
              <input
                type="password"
                id="currentPassword"
                placeholder="Enter your current password"
                {...registerPassword("currentPassword")}
              />
              {passwordErrors.currentPassword && (
                <p className="text-danger">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="newPassword">New Password</Label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                {...registerPassword("newPassword")}
              />
              {passwordErrors.newPassword && (
                <p className="text-danger">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="confirmPassword">Confirm New Password</Label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                {...registerPassword("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-danger">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </FormGroup>

            <Button color="success" type="submit" block>
              {passwordUpdating ? "Updating..." : "Change Password"}
            </Button>

            {error && <p className="text-danger mt-2">{error}</p>}
            {message && <p className="text-success mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
