import { useContext, useEffect, useState } from "react";

import Input from "../../components/input/input";
import RadioButton from "../../components/radio-button/radio-button";
import { AuthContext } from "../../contexts/auth";
import Axios from "../../services/axios";
import Cookies from "js-cookie";

const enum EditMode {
  PERSONAL_DATA = "PERSONAL_DATA",
  PASSWORD = "PASSWORD",
}

const editModeOptions = [
  { label: "Editar Dados pessoais", value: EditMode.PERSONAL_DATA },
  { label: "Editar Senha", value: EditMode.PASSWORD },
];

export default function EditMyData() {
  const { setLoggedUser, loggedUser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(EditMode.PERSONAL_DATA);

  const [name, setName] = useState(loggedUser?.name);
  const [email, setEmail] = useState(loggedUser?.email);
  const [phone, setPhone] = useState(loggedUser?.phone);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const savePassword = async () => {
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
        password: password,
      });
    }
  };

  const savePersonalData = async () => {
    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};
    if (!name) {
      errorFields.name = true;
      errorMessages.name = "Digite um nome";
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

    const legacyData = {
      name: loggedUser?.name,
      email: loggedUser?.email,
      phone: loggedUser?.phone,
    };

    const newData = {
      name: name,
      email: email,
      phone: phone && phone.replace(/[^\d]/g, ""),
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
                      label="Nome"
                      required={true}
                      onFieldChange={(event) => setName(event.target.value)}
                      fieldValue={name}
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
                      label="E-mail"
                      required={true}
                      onFieldChange={(event) => setEmail(event.target.value)}
                      fieldValue={email}
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
                      onFieldChange={(event) => setPhone(event.target.value)}
                      fieldValue={phone}
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
                      onFieldChange={(event) => setPassword(event.target.value)}
                      fieldValue={password}
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
                        setConfirmPassword(event.target.value)
                      }
                      fieldValue={confirmPassword}
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
