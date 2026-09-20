import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import { Dashboard, Leads } from "../Pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "leads",
        element: <Leads />,
      },
    ],
  },
]);
export default router