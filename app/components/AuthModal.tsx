"use client";

import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { CircularProgress, Alert } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const { loading, data, error } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { signIn, signUp } = useAuth();

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  useEffect(() => {
    if (loading) {
      setDisabled(true);
      return;
    }

    if (isSignIn) {
      if (inputs.password && inputs.email) {
        setDisabled(false);
        return;
      }
    } else {
      if (
        inputs.password &&
        inputs.email &&
        inputs.firstName &&
        inputs.lastName &&
        inputs.phone &&
        inputs.city
      ) {
        setDisabled(false);
        return;
      }
    }

    setDisabled(true);
  }, [inputs, loading]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    if (isSignIn) {
      await signIn(
        { email: inputs.email, password: inputs.password },
        handleClose
      );
    } else {
      await signUp(
        {
          email: inputs.email,
          password: inputs.password,
          phone: inputs.phone,
          city: inputs.city,
          first_name: inputs.firstName,
          last_name: inputs.lastName,
        },
        handleClose
      );
    }
  };

  return (
    <div>
      <button
        className={renderContent(
          "bg-blue-400 text-white mr-3 border p-1 px-4 rounded",
          "border p-1 px-4 rounded"
        )}
        onClick={handleOpen}
      >
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="px-2 py-24 h-[600px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[600px]">
              {error && (
                <Alert severity="error" className="mb-9">
                  {error}
                </Alert>
              )}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                {renderContent("Sign In", "Create Account")}
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log Into Your Account",
                    "Create Your OpenTable Account"
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  isSignIn={isSignIn}
                  handleChangeInput={handleChangeInput}
                />
                <button
                  disabled={disabled}
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
