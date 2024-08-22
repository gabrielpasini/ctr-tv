import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, ProfileType } from "../contexts/auth";
import Axios from "../services/axios";

type UserProfile = {
  username: string;
  name: string;
  lastname: string;
  profile: ProfileType;
};

export default function Profile() {
  const navigate = useNavigate();
  const { loggedUser } = useContext(AuthContext);
  const [userParam, setUserParam] = useState("");
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | undefined>();

  console.log({ profile, isMyProfile });

  function redirect(route: string) {
    navigate(route);
  }

  async function getUserProfile(
    userParam: string
  ): Promise<UserProfile | undefined> {
    const { data: userProfile }: { data: UserProfile } = await Axios.get(
      `user/get-profile?username=${userParam}`
    );
    setProfile(userProfile);
    return userProfile ?? undefined;
  }

  useEffect(() => {
    if (window.location.search) {
      const query = new URLSearchParams(window.location.search);
      const userParam = query.get("username");
      if (userParam) {
        setUserParam(userParam ?? "");
        getUserProfile(userParam).then((profileReturned) => {
          if (!profileReturned) redirect("/");
        });
      }
    } else {
      redirect("/");
    }
  }, [window.location.search]);

  useEffect(() => {
    if (loggedUser && loggedUser.username === userParam) {
      setIsMyProfile(true);
    }
  }, [loggedUser, userParam]);

  return (
    <div className="max-w-7xl pt-4 md:pt-0 mx-auto px-4">
      <div className="bg-light shadow mb-14 overflow-hidden rounded-md">
        <div className="px-4 py-5 bg-light md:p-6">
          <h1 className="font-crash text-4xl font font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {profile?.username}
          </h1>
          <h1 className="font font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {profile?.name} {profile?.lastname}
          </h1>
          <h1 className="font font-extrabold tracking-tight text-gray-900 md:text-6xl"></h1>
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
