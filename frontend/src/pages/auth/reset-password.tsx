import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/input";
import Axios from "../../services/axios";

const query = new URLSearchParams(window.location.search);
const email = query.get("email");
const passwordResetToken = query.get("token");

export default function ResetPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const handleChangePassword = async ({ password, confirmPassword }: any) => {
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

    if (
      !errorFields.password &&
      !errorFields.confirmPassword &&
      !errorMessages.password &&
      !errorMessages.confirmPassword
    ) {
      setErrors({});
      setMessages({});
      try {
        await Axios.post("auth/reset-password", {
          email,
          password,
          token: passwordResetToken,
        });
        navigate("/login");
      } catch (err) {
        throw err;
      }
    } else {
      setErrors(errorFields);
      setMessages(errorMessages);
    }
  };

  return (
    <>
      <div className="pt-6 pb-3 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <header className="bg-light rounded-md shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-gray-900">
              Redefinir sua senha
            </h1>
          </div>
        </header>
        <div className="mt-5 md:col-span-2">
          <form
            action="#"
            method="POST"
            onSubmit={handleSubmit(handleChangePassword)}
          >
            <div className="bg-light shadow overflow-hidden rounded-md">
              <div className="px-4 py-5 md:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 md:col-span-3">
                    <Input
                      label="Nova senha"
                      required={true}
                      register={register("password")}
                      type="password"
                      name="password"
                      id="password"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      control={control}
                      error={errors.password}
                      errorMessage={messages.password}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Input
                      label="Confirme sua nova senha"
                      required={true}
                      register={register("confirmPassword")}
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                      control={control}
                      error={errors.confirmPassword}
                      errorMessage={messages.confirmPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-dark-20 md:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-60"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
