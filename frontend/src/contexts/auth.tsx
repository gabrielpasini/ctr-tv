import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../services/axios";
import { routes, RouteProps } from "../Routes";
import Cookies from "js-cookie";
import { OptionType } from "../components/select/select";

type AuthenticateDataType = {
  username: string;
  password: string;
  id?: string;
  createdAt?: Date;
};

export type Character = {
  name: string;
  gameId: string;
};

export type ProfileType = {
  picture?: string;
  bio?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  mainCharacters?: Character[];
  favoriteGame?: OptionType;
};

export type LoggedUser = {
  username: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  birthDate?: string;
  profile?: ProfileType;
  createdAt?: string;
  _id?: string;
  __v?: any;
};

type AuthContextType = {
  isAuthenticated: boolean;
  loggedUser: LoggedUser | null;
  authenticate: (data: AuthenticateDataType) => Promise<void>;
  signOut: (data: string) => void;
  getUser: (data: string) => void;
  setLoggedUser: Dispatch<SetStateAction<LoggedUser | null>>;
  redirectUrl: string;
  setRedirectUrl: Dispatch<SetStateAction<string>>;
  activePath: string;
  activeRoute: RouteProps | undefined;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider: any = ({ children }: any) => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [activePath, setActivePath] = useState<string>(
    window.location.pathname
  );
  const activeRoute = routes.find((route) => activePath === route.path);
  const isAuthenticated = !!loggedUser;

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [window.location.pathname]);

  const getUser = async (token: string) => {
    try {
      const {
        data: { user },
      }: any = await Axios.get(`/user/get-user?token=${token}`);
      const persistedUser: LoggedUser | null = user;
      if (persistedUser === null) return;
      setLoggedUser(persistedUser);
      if (
        activePath === "/login" ||
        activePath === "/cadastro" ||
        activePath === "/redefinir-senha"
      )
        navigate("/");
    } catch (err) {
      throw err;
    }
  };

  async function authenticate({ username, password }: AuthenticateDataType) {
    try {
      const {
        data: { token, user },
      } = await Axios.post("/auth/authenticate", {
        username,
        password,
      });

      // @ts-ignore: Types do axios se perdendo
      Axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      Cookies.set("ctrtv-token", token, { expires: 15 });

      setLoggedUser(user);
      if (redirectUrl) {
        navigate(redirectUrl);
        setRedirectUrl("");
      } else {
        navigate("/");
      }
    } catch (err) {
      throw err;
    }
  }

  const signOut = (route: string) => {
    Cookies.remove("ctrtv-token");
    navigate(route);
    setLoggedUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        isAuthenticated,
        authenticate,
        signOut,
        getUser,
        redirectUrl,
        setRedirectUrl,
        activePath,
        activeRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
