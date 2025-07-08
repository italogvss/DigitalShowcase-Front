import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import UserDrawer from "../Components/DrawerUser";
import DashboardPage from "../Pages/DashboardPage";
import DevicesPage from "../Pages/Devices/DevicesPage";
import FAQPage from "../Pages/FAQPage";
import LoginPage from "../Pages/LoginPage";
import MediasPage from "../Pages/Medias/MediasPage";
import NotFoundPage from "../Pages/NotFoundPage";
import PlansPage from "../Pages/PlansPage";
import PlaylistEditPage from "../Pages/Playlists/PlaylistEdit";
import PlaylistsPage from "../Pages/Playlists/PlaylistsPage";
import PlaylistViewPage from "../Pages/Playlists/PlaylistViewPage";
import ProductsPage from "../Pages/Products/ProductsPage";
import TemplateEditPage from "../Pages/Templates/TemplateEdit";
import TemplatesPage from "../Pages/Templates/TemplatesPage";
import UserPage from "../Pages/Users/UsersPage";
import ProtectedRoute from "./ProtectedRoute";


export const router = createBrowserRouter([
  {
    
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "view/:code",
        element: <PlaylistViewPage />
      },
      {
        path: "",
        element: (
          <ProtectedRoute>
            <UserDrawer />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "playlists",
            element: <PlaylistsPage />,
          },
          {
            path: "playlists/edit/:id",
            element: <PlaylistEditPage />
          },
          {
            path: "media",
            element: <MediasPage />,
          },
          {
            path: "produtos",
            element: <ProductsPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />
          },
          {
            path: "users",
            element: <UserPage />
          },
          {
            path: "plans",
            element: <PlansPage />
          },
          {
            path: "faq",
            element: <FAQPage />
          },
          {
            path: "templates",
            element: <TemplatesPage />
          },
          {
            path: "templates/edit/:id",
            element: <TemplateEditPage />
          },
          {
            path: "displays",
            element: <DevicesPage />
          }
        ],
      },
    ],
  },
]);