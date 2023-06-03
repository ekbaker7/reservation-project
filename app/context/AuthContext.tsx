"use client";

import { useState, createContext, useEffect } from "react";
import { UserInformationType } from "../../lib/dbModels";
import axios from 'axios'
import { getCookie } from "cookies-next"

interface State {
  loading: boolean;
  error: string | null;
  data: UserInformationType | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: true,
  data: null,
  error: null,
  setAuthState: () => {},
});

function AuthContext({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    try { 
      setAuthState({
        loading: true,
        data: null,
        error: null
      });
      const jwt = getCookie("jwt")

      // No user present
      if (!jwt) {
        setAuthState({
          loading: false,
          data: null,
          error: null
        });
      }

      const response = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`

      setAuthState({
        loading: false,
        data: response.data,
        error: null
      });

    } catch (error) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthContext;
