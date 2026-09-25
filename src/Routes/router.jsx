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
} from "../Pages";
import LeadDetails from "../Pages/Leads/LeadDetails";
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
]);
export default router;
