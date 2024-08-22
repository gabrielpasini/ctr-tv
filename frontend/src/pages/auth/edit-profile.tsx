import { useContext, useEffect, useState } from "react";

import Input from "../../components/input/input";
import RadioButton from "../../components/radio-button/radio-button";
import { AuthContext, LoggedUser } from "../../contexts/auth";
import Axios from "../../services/axios";
import Cookies from "js-cookie";
import { Game } from "../tournament/create-tournament";
import Select, { OptionType } from "../../components/select/select";

const enum EditMode {
  PERSONAL_DATA = "PERSONAL_DATA",
  PASSWORD = "PASSWORD",
}

const editModeOptions = [
  { label: "Editar Dados pessoais", value: EditMode.PERSONAL_DATA },
  { label: "Editar Senha", value: EditMode.PASSWORD },
];

type PasswordForm = {
  password?: string;
  confirmPassword?: string;
};

const initialPersonalForm = {
  username: "",
  name: "",
  lastname: "",
  email: "",
  phone: "",
  birthDate: "",
};

const initialPasswordForm = {
  password: "",
  confirmPassword: "",
};

export default function EditProfile() {
  const { setLoggedUser, loggedUser } = useContext(AuthContext);

  const [personalForm, setPersonalForm] =
    useState<LoggedUser>(initialPersonalForm);
  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);
  const [editMode, setEditMode] = useState(EditMode.PERSONAL_DATA);
  const [games, setGames] = useState<OptionType[]>([{ label: "", value: "" }]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  console.log(personalForm);

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      setPersonalForm(loggedUser);
    }
  }, [loggedUser]);

  async function getGames() {
    const {
      data: { games },
    }: any = await Axios.get("game/get-all");
    setGames([
      {
        label: "",
        value: "",
      },
      ...games.map((game: Game) => ({
        label: `${game.name} - ${game.releaseYear}`,
        value: game._id,
      })),
    ]);
  }

  const savePassword = async () => {
    const { password, confirmPassword } = passwordForm;

    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};
    if (!password) {
      errorFields.password = true;
      errorMessages.password = "Digite uma senha";
    } else {
      const lowerCaseLetters = /[a-z]/g;
      if (!password.match(lowerCaseLetters)) {
        errorFields.password = true;
        errorMessages.password =
          "A senha precisa conter ao menos uma letra minúscula\n";
      } else {
        errorMessages.password = "";
      }
      const upperCaseLetters = /[A-Z]/g;
      if (!password.match(upperCaseLetters)) {
        errorFields.password = true;
        errorMessages.password +=
          "A senha precisa conter ao menos uma letra maiúscula\n";
      }
      const numbers = /[0-9]/g;
      if (!password.match(numbers)) {
        errorFields.password = true;
        errorMessages.password += "A senha precisa conter ao menos um número\n";
      }
      if (password.length < 8) {
        errorFields.password = true;
        errorMessages.password +=
          "A senha precisa conter ao menos 8 caracteres";
      }
    }
    if (!confirmPassword) {
      errorFields.confirmPassword = true;
      errorMessages.confirmPassword = "Digite uma confirmação de senha";
    } else if (confirmPassword !== password) {
      errorFields.confirmPassword = true;
      errorMessages.confirmPassword =
        "A confirmação de senha precisa ser exatamente igual";
    }

    if (Object.keys(errorFields).length) {
      setErrors(errorFields);
      setMessages(errorMessages);
      return;
    } else {
      setErrors({});
      setMessages({});
      const token = Cookies.get("ctrtv-token");
      await Axios.put("user/edit-password", {
        token,
        password,
      });
    }
  };

  const savePersonalData = async () => {
    const { username, name, lastname, email, phone, birthDate, profile } =
      personalForm;
    const { bio, youtubeUrl, twitchUrl, mainCharacters, favoriteGame } =
      profile ?? {};

    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};

    // PERSONAL DATA
    const usernameFormat = /^[a-zA-Z0-9._-]+$/;
    if (!username) {
      errorFields.username = true;
      errorMessages.username = "Digite um nome de usuário";
    } else if (username.length < 4 || username.length > 20) {
      errorFields.username = true;
      errorMessages.username =
        "O nome de usuário deve ter entre 4 e 20 caracteres";
    } else if (!usernameFormat.test(username)) {
      errorFields.username = true;
      errorMessages.username =
        "Nome de usuário inválido! Use apenas letras, números e - _ .";
    }
    if (!name) {
      errorFields.name = true;
      errorMessages.name = "Digite um nome";
    }
    if (!lastname) {
      errorFields.lastname = true;
      errorMessages.lastname = "Digite um sobrenome";
    }
    const emailFormat = /\S+@\S+\.\S+/;
    if (!email) {
      errorFields.email = true;
      errorMessages.email = "Digite um email";
    } else if (!emailFormat.test(email)) {
      errorFields.email = true;
      errorMessages.email = "E-mail inválido";
    }
    if (phone && phone.replace(/[^\d]/g, "").length < 11) {
      errorFields.phone = true;
      errorMessages.phone = "Seu telefone precisa ter o DDD + 9 digitos";
    }
    const birthDateFormat =
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (birthDate && !birthDateFormat.test(birthDate)) {
      errorFields.birthDate = true;
      errorMessages.birthDate = "A data está inválida";
    }
    // PROFILE
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

    const legacyData = {
      username: loggedUser?.username,
      name: loggedUser?.name,
      lastname: loggedUser?.lastname,
      email: loggedUser?.email,
      phone: loggedUser?.phone,
      birthDate: loggedUser?.birthDate,
      profile: {
        bio: loggedUser?.profile?.bio,
        youtubeUrl: loggedUser?.profile?.youtubeUrl,
        twitchUrl: loggedUser?.profile?.twitchUrl,
        mainCharacters: loggedUser?.profile?.mainCharacters,
        favoriteGame: loggedUser?.profile?.favoriteGame,
      },
    };

    const newData = {
      username,
      name,
      lastname,
      email,
      phone: phone && phone.replace(/[^\d]/g, ""),
      birthDate,
      profile: {
        bio,
        youtubeUrl,
        twitchUrl,
        mainCharacters,
        favoriteGame,
      },
    };

    if (JSON.stringify(legacyData) === JSON.stringify(newData)) {
      errorFields.nothingToEdit = true;
    }

    if (Object.keys(errorFields).length) {
      setErrors(errorFields);
      setMessages(errorMessages);
      return;
    } else {
      setErrors({});
      setMessages({});
      const token = Cookies.get("ctrtv-token");
      const {
        data: { user },
      } = await Axios.put("user/edit-user", {
        token,
        editedData: newData,
        isEditedEmail: legacyData?.email !== newData?.email,
        isEditedUsername: legacyData?.username !== newData?.username,
      });
      setLoggedUser(user);
    }
  };

  return (
    <>
      <div className="max-w-7xl pt-4 md:pt-0 mx-auto px-4">
        <div className="bg-light rounded-md shadow">
          <div className="col-span-6 md:col-span-4 pt-2 pb-4 px-4 md:px-6 lg:px-8">
            <RadioButton
              onFieldChange={(event) => setEditMode(event.target.value)}
              fieldValue={editMode}
              name="editMode"
              className="focus:border-dark h-4 w-4 text-highlight border-gray-300"
              options={editModeOptions}
            />
          </div>
        </div>
        <div className="mt-5 md:col-span-2">
          {editMode === EditMode.PERSONAL_DATA ? (
            <div className="bg-light shadow mb-14 overflow-hidden rounded-md">
              <div className="px-4 py-5 bg-light md:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Nome de usuário"
                      required={true}
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          username: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.username}
                      type="text"
                      name="username"
                      id="username"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.username}
                      errorMessage={messages.username}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Nome"
                      required={true}
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          name: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.name}
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.name}
                      errorMessage={messages.name}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Sobrenome"
                      required={true}
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          lastname: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.lastname}
                      type="text"
                      name="lastname"
                      id="lastname"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.lastname}
                      errorMessage={messages.lastname}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="E-mail"
                      required={true}
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          email: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.email}
                      type="text"
                      inputMode="email"
                      name="email"
                      id="email"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.email}
                      errorMessage={messages.email}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Telefone"
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          phone: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.phone}
                      type="text"
                      inputMode="numeric"
                      name="phone"
                      id="phone"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      mask="(99)99999-9999"
                      error={errors.phone}
                      errorMessage={messages.phone}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Data de nascimento"
                      placeholder="DD/MM/AAAA"
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          birthDate: event.target.value,
                        }))
                      }
                      fieldValue={personalForm.birthDate}
                      type="text"
                      name="birthDate"
                      id="birthDate"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      mask="99/99/9999"
                      error={errors.birthDate}
                      errorMessage={messages.birthDate}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Youtube"
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          profile: {
                            ...prevForm.profile,
                            youtubeUrl: event.target.value,
                          },
                        }))
                      }
                      fieldValue={personalForm.profile?.youtubeUrl}
                      placeholder="Insira a url do seu canal"
                      type="text"
                      name="youtubeUrl"
                      id="youtubeUrl"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.youtubeUrl}
                      errorMessage={messages.youtubeUrl}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Twitch"
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          profile: {
                            ...prevForm.profile,
                            twitchUrl: event.target.value,
                          },
                        }))
                      }
                      fieldValue={personalForm.profile?.twitchUrl}
                      placeholder="Insira a url do seu canal"
                      type="text"
                      name="twitchUrl"
                      id="twitchUrl"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.twitchUrl}
                      errorMessage={messages.twitchUrl}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Select
                      label="Jogo preferido"
                      id="game"
                      name="game"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:border-dark-blue md:text-sm"
                      options={games}
                      onFieldChange={(event) =>
                        setPersonalForm((prevForm) => ({
                          ...prevForm,
                          profile: {
                            ...prevForm.profile,
                            favoriteGame: games.find(
                              (game) => event.target.value === game.value
                            ),
                          },
                        }))
                      }
                      fieldValue={personalForm.profile?.favoriteGame?.value}
                      error={false}
                      errorMessage={""}
                    />
                  </div>
                  {errors.nothingToEdit && (
                    <div className="col-span-6 md:col-span-4">
                      <p className="text-sm font-small text-red-500">
                        Nenhum campo foi alterado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
                <button
                  onClick={savePersonalData}
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-60"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="shadow bg-light mb-14 overflow-hidden rounded-md">
              <div className="px-4 py-5 bg-light md:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Senha"
                      required={true}
                      onFieldChange={(event) =>
                        setPasswordForm((prevForm) => ({
                          ...prevForm,
                          password: event.target.value,
                        }))
                      }
                      fieldValue={passwordForm.password}
                      type="password"
                      name="password"
                      id="password"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.password}
                      errorMessage={messages.password}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <Input
                      label="Confirmar senha"
                      required={true}
                      onFieldChange={(event) =>
                        setPasswordForm((prevForm) => ({
                          ...prevForm,
                          confirmPassword: event.target.value,
                        }))
                      }
                      fieldValue={passwordForm.confirmPassword}
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      error={errors.confirmPassword}
                      errorMessage={messages.confirmPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
                <button
                  onClick={savePassword}
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-60"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
