import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import {
  Dashboard,
  Leads,
  Customers,
  Deals,
  Tasks,
  Activities,
  Sales,
  Settings,
  Auth,
} from "../Pages";
import LeadDetails from "../Pages/Leads/LeadDetails";
import ProtectedRoute from "../Components/ProtectedRoute";
const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    element: <ProtectedRoute />,
    children: [
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
          {
            path: "leads/:id",
            element: <LeadDetails />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "deals",
            element: <Deals />,
          },
          {
            path: "tasks",
            element: <Tasks />,
          },
          {
            path: "activities",
            element: <Activities />,
          },
          {
            path: "sales",
            element: <Sales />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);
export default router;
