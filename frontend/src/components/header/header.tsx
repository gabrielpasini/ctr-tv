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
import { AuthContext } from "../../contexts/auth";
import { Container, MenuItems, UserIcon } from "./styles";
import { routes } from "../../Routes";

type HeaderProps = {
  setHeight: Dispatch<SetStateAction<number | undefined>>;
};

type NavItem = {
  name: string;
  href: string;
  current: boolean;
  canSignOut?: boolean;
};

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
  const [navigation, setNavigation] = useState<NavItem[]>([
    { name: "Início", href: "/", current: false },
    { name: "Comunidade", href: "/comunidade", current: false },
    { name: "Quem Somos", href: "/quem-somos", current: false },
  ]);
  const [userNavigation, setUserNavigation] = useState<NavItem[]>([
    { name: "Editar meus dados", href: "/editar-perfil", current: false },
    {
      name: "Sair",
      href: "/login",
      canSignOut: true,
      current: false,
    },
  ]);

  useEffect(() => {
    setHeight(ref?.current?.clientHeight);
  }, []);

  const redirect = (route: string, fromBreadcrumb?: boolean) => {
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

  useEffect(() => {
    const newNavigation = navigation.map((route: NavItem) => {
      if (route.href === activePath) route.current = true;
      else route.current = false;
      return route;
    });
    const newUserNavigation = userNavigation.map((route: NavItem) => {
      if (route.href === activePath) route.current = true;
      else route.current = false;
      return route;
    });
    setNavigation(newNavigation);
    setUserNavigation(newUserNavigation);
  }, [activePath]);

  function renderRouteInfo(): ReactElement {
    return (
      <div className="md:hidden w-full min-h-full flex flex-col direction-column items-center justify-center text-center">
        <h1 className="text-dark-blue font-extrabold">{title}</h1>
        {subtitle && <h2 className="text-dark-blue-60 text-xs">{subtitle}</h2>}
      </div>
    );
  }

  return (
    <>
      <Container ref={ref}>
        <Disclosure as="nav" className="bg-light-blue shadow-lg">
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
                              item.current
                                ? "default bg-dark-blue text-white"
                                : "pointer text-dark-blue hover:bg-dark-blue-60 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
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
                          <Menu.Button className="max-w-xs bg-dark-blue rounded-full flex items-center text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white hover:bg-dark-blue-60">
                            <UserIcon />
                          </Menu.Button>
                        </div>
                        <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg pt-1 bg-light-blue ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <span className="default text-dark-blue-60 block px-4 py-2 text-sm">
                              Olá {loggedUser?.name}
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
                                  item.current
                                    ? "default bg-dark-blue text-white"
                                    : "text-dark-blue hover:bg-dark-blue-60 hover:text-white",
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
                          className="whitespace-nowrap text-base font-medium text-dark-blue hover:text-white"
                        >
                          Entrar
                        </button>
                        {activePath !== "/cadastro" ? (
                          <button
                            type="button"
                            onClick={() => onClickMenuItem(close, "/cadastro")}
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-dark-blue hover:bg-dark-blue-60"
                          >
                            Cadastre-se
                          </button>
                        ) : (
                          <button
                            disabled
                            type="button"
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-dark-blue-40 bg-dark-blue-20"
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
                    <Disclosure.Button className="bg-light-blue inline-flex items-center justify-center p-2 rounded-md text-dark-blue hover:text-white hover:bg-dark-blue">
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
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
                          item.current
                            ? "default bg-dark-blue text-white"
                            : "pointer text-dark-blue hover:bg-dark-blue-60 hover:text-white",
                          "block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                        )}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 pb-3 border-t border-dark-blue">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0 bg-dark-blue rounded-full flex items-center text-sm">
                        {isAuthenticated && <UserIcon />}
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
                              item.current
                                ? "default bg-dark-blue text-white"
                                : "pointer text-dark-blue hover:bg-dark-blue-60 hover:text-white",
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
                              onClick={() =>
                                onClickMenuItem(close, "/cadastro")
                              }
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-dark-blue hover:bg-dark-blue-60"
                            >
                              Cadastre-se
                            </button>
                          ) : (
                            <button
                              disabled={true}
                              type="button"
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-dark-blue-40 bg-dark-blue-20"
                            >
                              Cadastre-se
                            </button>
                          )}
                          <p className="mt-6 text-center text-base font-medium text-gray-500">
                            Já possui uma conta?{" "}
                            <button
                              type="button"
                              onClick={() => onClickMenuItem(close, "/login")}
                              className="text-dark-blue hover:text-dark-blue-60"
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
          <header className="hidden md:block bg-dark-blue">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li
                    className="pointer inline-flex items-center text-sm font-medium text-white hover:text-light-blue"
                    onClick={() => redirect("/", true)}
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
                        className={`pointer hover:text-light-blue inline-flex items-center text-sm font-medium text-white ${
                          isActive && "default hover:none text-light-blue"
                        }`}
                        onClick={() => !isActive && redirect(path, true)}
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
    </>
  );
}
