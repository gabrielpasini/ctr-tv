import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

export default function Profile() {
  const navigate = useNavigate();
  const { loggedUser, activePath } = useContext(AuthContext);

  const profileUsername = useMemo(
    () => activePath && activePath.split("/")[2],
    [activePath]
  );

  useEffect(() => {
    if (loggedUser && loggedUser.username === profileUsername) {
      console.log("É MEU");
    } else if (loggedUser === null) {
      console.log("NUM É MEU");
    }
  }, [loggedUser]);

  function redirect(route: string) {
    navigate(route);
  }

  return (
    <div className="max-w-7xl pt-4 md:pt-0 mx-auto px-4">
      <div className="bg-light shadow mb-14 overflow-hidden rounded-md">
        <div className="px-4 py-5 bg-light md:p-6">
          <div className="grid grid-cols-6 gap-6">HUE</div>
        </div>
        <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-40"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
