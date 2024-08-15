import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  EditProfile,
  ResetPassword,
  Community,
  Team,
  TermsOfUse,
} from "./pages";
import PrivateRoute from "./private-route";
import { ReactElement } from "react";

export interface RouteProps {
  title: string;
  subtitle?: string;
  path: string;
  element: ReactElement;
  private?: boolean;
}

export const routes: RouteProps[] = [
  { title: "Início", path: "/", element: <Home /> },
  { title: "Login", path: "/login", element: <Login /> },
  { title: "Cadastro", path: "/cadastro", element: <Register /> },
  {
    title: "Editar perfil",
    path: "/editar-perfil",
    element: <EditProfile />,
    private: true,
  },
  {
    title: "Redefinir senha",
    path: "/redefinir-senha",
    element: <ResetPassword />,
  },
  {
    title: "Comunidade",
    path: "/comunidade",
    element: <Community />,
  },
  {
    title: "Quem somos",
    path: "/quem-somos",
    element: <Team />,
  },
  {
    title: "Termos de uso",
    path: "/termos-de-uso",
    element: <TermsOfUse />,
  },
];

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) =>
        route.private ? (
          <Route path={route.path} element={<PrivateRoute />} key={route.path}>
            <Route path={route.path} element={route.element} />
          </Route>
        ) : (
          <Route path={route.path} element={route.element} key={route.path} />
        )
      )}
    </Routes>
  );
}
