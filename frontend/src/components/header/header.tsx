import { Disclosure, Menu } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import { Container, MenuItems, UserIcon } from "./styles";
import { routes } from "../../Routes";

type HeaderProps = {
  setHeight: Dispatch<SetStateAction<number | undefined>>;
};

type NavItem = {
  name: string;
  href: string;
  canSignOut?: boolean;
};

const initialUserNavigation = [
  { name: "Editar dados pessoais", href: "/editar-perfil" },
  {
    name: "Sair",
    href: "/login",
    canSignOut: true,
  },
];

const navigation = [
  { name: "Início", href: "/" },
  { name: "Comunidade", href: "/comunidade" },
  { name: "Quem Somos", href: "/quem-somos" },
];

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Header({ setHeight }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, loggedUser, signOut, activePath, activeRoute } =
    useContext(AuthContext);
  const { title, subtitle } = activeRoute ?? {};
  const breadCrumbRoutes: string[] = [];
  activeRoute?.path.split("/").reduce((prev, curr, index) => {
    const path = `${prev}/${curr}`;
    if (index > 0) breadCrumbRoutes.push(path);
    return path;
  });
  const ref = useRef<HTMLDivElement>(null);
  const [userNavigation, setUserNavigation] = useState<NavItem[]>(
    initialUserNavigation
  );

  useEffect(() => {
    setHeight(ref?.current?.clientHeight);
  }, [ref?.current?.clientHeight, activePath]);

  useEffect(() => {
    if (
      loggedUser &&
      !userNavigation.some((nav) => nav.href.includes("/perfil"))
    ) {
      setUserNavigation((prevNav) => [
        {
          name: "Meu perfil",
          href: `/perfil?username=${loggedUser.username}`,
        },
        ...prevNav,
      ]);
    } else if (loggedUser) {
      const newNavigation = userNavigation.map((nav) => {
        if (nav.href.includes("/perfil")) {
          nav.href = `/perfil?username=${loggedUser.username}`;
        }
        return nav;
      });
      setUserNavigation(newNavigation);
    }
  }, [loggedUser]);

  const redirect = (route: string) => {
    if (activePath !== route) {
      navigate(route);
    }
  };

  const onClickMenuItem = (
    close: () => void,
    href: string,
    canSignOut?: boolean
  ) => {
    if (canSignOut === true) {
      signOut(href);
    } else {
      redirect(href);
    }
    close();
  };

  function renderRouteInfo(): ReactElement {
    return (
      <div className="md:hidden w-full min-h-full flex flex-col direction-column items-center justify-center text-center">
        <h1 className="text-dark font-extrabold">{title}</h1>
        {subtitle && <h2 className="text-dark-60 text-xs">{subtitle}</h2>}
      </div>
    );
  }

  return (
    <Container ref={ref}>
      <Disclosure as="nav" className="bg-light shadow-lg">
        {({ open, close }: any) => (
          <>
            {open
              ? setHeight(ref?.current?.clientHeight)
              : setHeight(ref?.current?.clientHeight)}
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 pointer"
                    onClick={() => onClickMenuItem(close, "/")}
                  >
                    <img
                      style={{ filter: "drop-shadow(4px 4px 4px #222)" }}
                      className="h-8 w-8"
                      src="https://i.imgur.com/TAxIH1J.png"
                      alt="app logo"
                      height="40"
                      width="40"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-center space-x-2">
                      {navigation.map((item: NavItem) => (
                        <div
                          key={item.name}
                          onClick={() => onClickMenuItem(close, item.href)}
                          className={classNames(
                            activePath === item.href
                              ? "default bg-dark-40 text-white"
                              : "pointer text-dark hover:bg-highlight-60 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={
                            activePath === item.href ? "page" : undefined
                          }
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  {isAuthenticated ? (
                    <Menu as="div" className="pointer ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-dark rounded-full overflow-hidden flex items-center text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white hover:bg-highlight-60">
                          {loggedUser?.profile?.avatar ? (
                            <img
                              height="24"
                              width="24"
                              src={`${import.meta.env.VITE_BACKEND_URL}${
                                loggedUser?.profile.avatar
                              }`}
                            />
                          ) : (
                            <FiUser
                              size={24}
                              color="fff"
                              className="my-1 mx-1"
                            />
                          )}
                        </Menu.Button>
                      </div>
                      <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg pt-1 bg-light ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <span className="default text-dark-60 block px-4 py-2 text-sm">
                            Olá {loggedUser?.username}
                          </span>
                        </Menu.Item>
                        {userNavigation.map((item: NavItem) => (
                          <Menu.Item key={item.name}>
                            <button
                              type="button"
                              onClick={() =>
                                onClickMenuItem(
                                  close,
                                  item.href,
                                  item.canSignOut
                                )
                              }
                              className={classNames(
                                activePath === item.href
                                  ? "default bg-dark-40 text-white"
                                  : "text-dark hover:bg-highlight-60 hover:text-white",
                                "block w-full px-4 py-2 text-sm text-left"
                              )}
                            >
                              {item.name}
                            </button>
                          </Menu.Item>
                        ))}
                      </MenuItems>
                    </Menu>
                  ) : (
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                      <button
                        type="button"
                        onClick={() => onClickMenuItem(close, "/login")}
                        className="whitespace-nowrap text-base font-medium text-dark hover:text-highlight"
                      >
                        Entrar
                      </button>
                      {activePath !== "/cadastro" ? (
                        <button
                          type="button"
                          onClick={() => onClickMenuItem(close, "/cadastro")}
                          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-dark hover:bg-highlight-60"
                        >
                          Cadastre-se
                        </button>
                      ) : (
                        <button
                          disabled
                          type="button"
                          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-dark-40 bg-dark-20"
                        >
                          Cadastre-se
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {renderRouteInfo()}
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-light inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-white hover:bg-highlight-60">
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            {/* MOBILE */}
            {open && (
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 md:px-3">
                  {navigation.map((item: NavItem) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => onClickMenuItem(close, item.href)}
                      className={classNames(
                        activePath === item.href
                          ? "default bg-dark-40 text-white"
                          : "pointer text-dark hover:bg-highlight-60 hover:text-white",
                        "block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-dark">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0 bg-dark rounded-full flex items-center text-sm overflow-hidden">
                      {isAuthenticated &&
                        (loggedUser?.profile?.avatar ? (
                          <img
                            height="24"
                            width="24"
                            src={`${import.meta.env.VITE_BACKEND_URL}${
                              loggedUser?.profile.avatar
                            }`}
                          />
                        ) : (
                          <FiUser size={24} color="fff" className="my-1 mx-1" />
                        ))}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-gray-500">
                        {loggedUser?.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {loggedUser?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {isAuthenticated ? (
                      userNavigation.map((item: NavItem) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() =>
                            onClickMenuItem(close, item.href, item.canSignOut)
                          }
                          className={classNames(
                            activePath === item.href
                              ? "default bg-dark-40 text-white"
                              : "pointer text-dark hover:bg-highlight-60 hover:text-white",
                            "block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                          )}
                        >
                          {item.name}
                        </button>
                      ))
                    ) : (
                      <div>
                        {activePath !== "/cadastro" ? (
                          <button
                            type="button"
                            onClick={() => onClickMenuItem(close, "/cadastro")}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-highlight hover:bg-highlight-40"
                          >
                            Cadastre-se
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-dark-40 bg-dark-20"
                          >
                            Cadastre-se
                          </button>
                        )}
                        <p className="mt-6 text-center text-base font-medium text-gray-500">
                          Já possui uma conta?{" "}
                          <button
                            type="button"
                            onClick={() => onClickMenuItem(close, "/login")}
                            className="text-highlight hover:text-highlight-40"
                          >
                            Faça login
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            )}
          </>
        )}
      </Disclosure>
      {!navigation.some((route) => route.href === activePath) && (
        <header className="hidden md:block bg-dark">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li
                  className="pointer inline-flex items-center text-sm font-medium text-white hover:text-light"
                  onClick={() => redirect("/")}
                >
                  <img
                    src="/assets/icons/home.svg"
                    width="10"
                    height="10"
                    alt="home_icon"
                    className="mr-1"
                  />
                  Início
                </li>
                {breadCrumbRoutes.map((path, index) => {
                  const isActive = activePath === path;
                  return (
                    <li
                      key={index}
                      className={`pointer hover:text-light inline-flex items-center text-sm font-medium text-white ${
                        isActive && "default hover:none text-light"
                      }`}
                      onClick={() => !isActive && redirect(path)}
                    >
                      <img
                        src="/assets/icons/arrow-right.svg"
                        width="6"
                        height="6"
                        alt="arrow_icon"
                        className="mr-1"
                      />
                      {routes?.find((route) => route.path === path)?.title}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </header>
      )}
    </Container>
  );
}
