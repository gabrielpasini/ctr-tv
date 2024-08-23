import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, ProfileType } from "../contexts/auth";
import Axios from "../services/axios";
import { calculateAge } from "../services/string";
import { FiUser } from "react-icons/fi";

type UserProfile = {
  username: string;
  name: string;
  lastname: string;
  phone: string;
  birthDate: string;
  profile: ProfileType;
};

export default function Profile() {
  const navigate = useNavigate();
  const { loggedUser } = useContext(AuthContext);
  const [userParam, setUserParam] = useState("");
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [user, setUserProfile] = useState<UserProfile | undefined>();

  function redirect(route: string) {
    navigate(route);
  }

  async function getUserProfile(
    userParam: string
  ): Promise<UserProfile | undefined> {
    const { data: userProfile }: { data: UserProfile } = await Axios.get(
      `user/get-profile?username=${userParam}`
    );
    setUserProfile(userProfile);
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
          {user?.profile.avatar ? (
            <img
              style={{ width: 100, height: 100 }}
              className="bg-dark rounded-full"
              src={`${import.meta.env.VITE_BACKEND_URL}${user?.profile.avatar}`}
              alt={user?.username}
            />
          ) : (
            <FiUser
              style={{ width: 100, height: 100 }}
              className="rounded-full bg-dark text-light"
            />
          )}
          <h1 className="font-crash-like text-6xl font font-extrabold tracking-tight text-gray-900">
            {user?.username}
          </h1>
          {user?.profile.bio && (
            <>
              <h1 className="font tracking-tight text-gray-900">Sobre:</h1>
              <pre>
                <h1 className="px-2 py-2 border border-dark bg-dark-20 rounded-md font tracking-tight text-gray-900">
                  {user?.profile.bio}
                </h1>
              </pre>
            </>
          )}
          {(user?.profile.youtubeUrl || user?.profile.twitchUrl) && (
            <div className="mb-2 mt-4 flex flex-row items-center">
              {user?.profile.youtubeUrl && (
                <a
                  target="_blank"
                  href={user?.profile.youtubeUrl}
                  className="inline-flex justify-center items-center py-1 px-2 shadow-sm text-sm font-medium rounded-md text-white bg-red hover:opacity-75"
                >
                  Youtube
                  <img
                    style={{ width: 24, height: 24 }}
                    className="ml-2"
                    src="https://i.imgur.com/QhSaRgM.png"
                    alt="youtube logo"
                  />
                </a>
              )}
              {user?.profile.twitchUrl && (
                <a
                  target="_blank"
                  href={user?.profile.twitchUrl}
                  className={`${
                    user?.profile.youtubeUrl ? "ml-2" : ""
                  } inline-flex justify-center items-center py-1 px-2 shadow-sm text-sm font-medium rounded-md text-white bg-purple hover:opacity-75`}
                >
                  Twitch
                  <img
                    style={{ width: 24, height: 24 }}
                    className="ml-2"
                    src="https://i.imgur.com/febkonn.png"
                    alt="twitch logo"
                  />
                </a>
              )}
            </div>
          )}
          <h1 className="font tracking-tight text-gray-900">
            Nome: {user?.name} {user?.lastname}
          </h1>
          {user?.birthDate && (
            <h1 className="font tracking-tight text-gray-900">
              Idade: {calculateAge(user.birthDate)} anos
            </h1>
          )}
          {user?.profile.favoriteGame && (
            <h1 className="font tracking-tight text-gray-900">
              Jogo preferido: {user?.profile.favoriteGame.label}
            </h1>
          )}
          <h1 className="font tracking-tight text-gray-900"></h1>
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
