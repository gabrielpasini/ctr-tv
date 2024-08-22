import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import Axios from "../../services/axios";

type UrlParams = {
  id: string;
  username: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const { loggedUser } = useContext(AuthContext);
  const [urlParams, setUrlParams] = useState<UrlParams>({
    id: "",
    username: "",
  });
  const [isMyProfile, setisMyProfile] = useState(false);

  function redirect(route: string) {
    navigate(route);
  }

  async function getUserProfile({ id, username }: UrlParams) {
    console.log({ id, username });
    // TODO: buscar profile na API;
  }

  useEffect(() => {
    if (window.location.search) {
      const query = new URLSearchParams(window.location.search);
      const usernameParam = query.get("username");
      const idParam = query.get("id");
      const params = { id: idParam ?? "", username: usernameParam ?? "" };
      setUrlParams(params);
      getUserProfile(params);
    } else {
      redirect("/");
    }
  }, [window.location.search]);

  useEffect(() => {
    if (loggedUser && loggedUser.username === urlParams.username) {
      setisMyProfile(true);
    }
  }, [loggedUser]);

  return (
    <div className="max-w-7xl pt-4 md:pt-0 mx-auto px-4">
      <div className="bg-light shadow mb-14 overflow-hidden rounded-md">
        <div className="px-4 py-5 bg-light md:p-6">
          <h1 className="font-crash text-4xl font font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {loggedUser?.username}
          </h1>
        </div>
        {isMyProfile && (
          <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => redirect("/editar-perfil")}
              className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-40"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
