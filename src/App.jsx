import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/router";
import { Toaster } from "react-hot-toast";
import useThemeStore from "./Store/themeStore";

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
