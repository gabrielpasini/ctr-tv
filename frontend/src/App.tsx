import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AppRoutes } from "./Routes";
import { AuthContext } from "./contexts/auth";
import useCheckMobileScreen from "./hooks/use-check-mobile-screen";
import Header from "./components/header/header";
import HelpButton from "./components/help-button/help-button";

const App = () => {
  const isMobile = useCheckMobileScreen();
  const [height, setHeight] = useState<number | undefined>(0);
  const { getUser, loggedUser, activePath } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    // if (window.location.search) {
    //   const query = new URLSearchParams(window.location.search);
    //   const deviceParam = query.get("device");
    // }
  }, [window.location.pathname, window.location.search]);

  useEffect(() => {
    const token =
      Cookies.get("ctrtv-token") ?? localStorage.getItem("ctrtv-token");
    if (token && !loggedUser) getUser && getUser(token);
  }, [activePath]);

  return (
    <>
      {activePath !== "/login" && <Header setHeight={setHeight} />}
      <div style={{ marginTop: activePath !== "/login" ? height : 0 }}>
        <AppRoutes />
      </div>
      {activePath !== "/comunidade" && <HelpButton isMobile={isMobile} />}
    </>
  );
};

export default App;
