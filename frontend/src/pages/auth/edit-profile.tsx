import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Axios from "../../services/axios";
import Input from "../../components/input/input";
import { AuthContext } from "../../contexts/auth";

export default function EditProfile() {
  const navigate = useNavigate();
  const { setLoggedUser } = useContext(AuthContext);
  const { register, handleSubmit, control } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  function redirect(route: string) {
    navigate(route);
  }

  const handleRegister = async (fields: { [key: string]: string }) => {
    const {
      bio,
      youtubeUrl,
      twitchUrl,
      birthDate,
      mainCharacter,
      favoriteGame,
    } = fields;

    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};

    const youtubeUrlFormat =
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:user\/|channel\/|c\/|@)([a-zA-Z0-9_-]+)$/;
    if (youtubeUrl && !youtubeUrlFormat.test(youtubeUrl)) {
      errorFields.youtubeUrl = true;
      errorMessages.youtubeUrl = "A url está inválida";
    }
    const twitchUrlFormat =
      /^(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv|twitch\.com)\/([a-zA-Z0-9_]+)$/;
    if (twitchUrl && !twitchUrlFormat.test(twitchUrl)) {
      errorFields.twitchUrl = true;
      errorMessages.twitchUrl = "A url está inválida";
    }
    const birthDateFormat =
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (birthDate && !birthDateFormat.test(birthDate)) {
      errorFields.birthDate = true;
      errorMessages.birthDate = "A data está inválida";
    }

    if (Object.keys(errorFields).length) {
      setErrors(errorFields);
      setMessages(errorMessages);
      return;
    } else {
      setErrors({});
      setMessages({});
      console.log("SUCESSO!!!");
      //   const {
      //     data: { user },
      //   } = await Axios.post("auth/register", {
      //     name,
      //     email,
      //     password,
      //     phone: phone && phone.replace(/[^\d]/g, ""),
      //   });

      //   setLoggedUser(user);
      //   redirect("/");
    }
  };

  return (
    <div className="max-w-7xl pt-4 md:pt-0 mx-auto px-4">
      <form action="#" method="POST" onSubmit={handleSubmit(handleRegister)}>
        <div className="bg-light shadow mb-14 overflow-hidden rounded-md">
          <div className="px-4 py-5 bg-light md:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Youtube"
                  register={register("youtubeUrl")}
                  placeholder="Insira a url do seu canal"
                  type="text"
                  name="youtubeUrl"
                  id="youtubeUrl"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.youtubeUrl}
                  errorMessage={messages.youtubeUrl}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Twitch"
                  register={register("twitchUrl")}
                  placeholder="Insira a url do seu canal"
                  type="text"
                  name="twitchUrl"
                  id="twitchUrl"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.twitchUrl}
                  errorMessage={messages.twitchUrl}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Data de nascimento"
                  placeholder="DD/MM/AAAA"
                  register={register("birthDate")}
                  type="text"
                  name="birthDate"
                  id="birthDate"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  mask="99/99/9999"
                  control={control}
                  error={errors.birthDate}
                  errorMessage={messages.birthDate}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-40"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
