import axios from "axios";
import { NewUserType } from "../lib/dbModels";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext"
import { removeCookies } from "cookies-next"

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(
    AuthenticationContext
  );

  const signIn = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    try {
      setAuthState({ loading: true, data: null, error: null });
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      setAuthState({ loading: false, data: response.data, error: null });
      handleClose();
    } catch (error) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  const signUp = async (newUser: NewUserType, handleClose: () => void) => {
    try {
      const response = await axios.post("/api/auth/signup", { ...newUser });
      setAuthState({ loading: false, data: response.data, error: null });
      handleClose();
    } catch (error) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  }

  const signOut = () => {
    removeCookies("jwt")
    setAuthState({
      loading: false,
      data: null,
      error: null
    });
  }

  return {
    signIn,
    signUp,
    signOut
  };
};

export default useAuth;
