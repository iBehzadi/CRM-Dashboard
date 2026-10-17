
import { create } from "zustand";

const getSavedAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth")) || null;
  } catch {
    return null;
  }
};

const savedAuth = getSavedAuth();

const useAuthStore = create((set) => ({
  isAuthenticated: Boolean(savedAuth?.jwt && savedAuth?.user),
  user: savedAuth?.user || null,
  jwt: savedAuth?.jwt || null,

  login: (authData) => {
    localStorage.setItem("auth", JSON.stringify(authData));

    set({
      isAuthenticated: true,
      user: authData.user,
      jwt: authData.jwt,
    });
  },

  logout: () => {
    localStorage.removeItem("auth");

    set({
      isAuthenticated: false,
      user: null,
      jwt: null,
    });
  },
}));

export default useAuthStore;
