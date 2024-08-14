import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth";

const useCheckMobileScreen = () => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return width <= 768;
};

export default useCheckMobileScreen;
