import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  jwt: null,

  login: (authData) =>
    set({
      isAuthenticated: true,
      user: authData.user,
      jwt: authData.jwt,
    }),

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