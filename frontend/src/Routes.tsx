import { Route, Routes } from "react-router-dom";
import {
  Cadastro,
  Comunidade,
  EditarPerfil,
  Home,
  Login,
  RedefinirSenha,
  TermosDeUso,
  QuemSomos,
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
  { title: "Cadastro", path: "/cadastro", element: <Cadastro /> },
  {
    title: "Redefinir senha",
    path: "/redefinir-senha",
    element: <RedefinirSenha />,
  },
  {
    title: "Termos de uso",
    path: "/termos-de-uso",
    element: <TermosDeUso />,
  },
  {
    title: "Comunidade",
    path: "/comunidade",
    element: <Comunidade />,
  },
  {
    title: "Quem somos",
    path: "/quem-somos",
    element: <QuemSomos />,
  },
  {
    title: "Editar perfil",
    path: "/editar-perfil",
    element: <EditarPerfil />,
    private: true,
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
