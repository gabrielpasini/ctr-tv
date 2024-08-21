import { createRef, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Axios from "../../services/axios";
import Input from "../../components/input/input";
import { AuthContext } from "../../contexts/auth";
import Checkbox from "../../components/checkbox/checkbox";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const navigate = useNavigate();
  const { setLoggedUser } = useContext(AuthContext);
  const { register, handleSubmit, control } = useForm();
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [termsOfUse, setTermsOfUse] = useState(true);
  const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);

  function redirect(route: string) {
    navigate(route);
  }

  async function onRecaptchaChange(token: string | null) {
    if (token !== null) {
      setIsRecaptchaValid(true);
      return;
    }

    recaptchaRef.current?.reset();
  }

  const handleRegister = async (fields: { [key: string]: string }) => {
    const {
      username,
      name,
      lastname,
      email,
      password,
      confirmPassword,
      phone,
    } = fields;

    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};

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
    if (phone && phone.replace(/[^\d]/g, "").length < 11) {
      errorFields.phone = true;
      errorMessages.phone = "Seu telefone precisa ter o DDD + 9 digitos";
    }
    if (!termsOfUse) {
      errorFields.termsOfUse = true;
      errorMessages.termsOfUse = "Você precisa aceitar os termos";
    }
    if (!isRecaptchaValid) {
      errorFields.recaptcha = true;
      errorMessages.recaptcha = "Complete o captcha";
    }

    if (Object.keys(errorFields).length) {
      setErrors(errorFields);
      setMessages(errorMessages);
      return;
    } else {
      setErrors({});
      setMessages({});
      const {
        data: { token, user },
      } = await Axios.post("auth/register", {
        username,
        name,
        lastname,
        email,
        password,
        phone: phone && phone.replace(/[^\d]/g, ""),
      });
      Cookies.set("ctrtv-token", token, { expires: 15 });

      // @ts-ignore: Types do axios se perdendo
      Axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      setLoggedUser(user);
      redirect("/");
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
                  label="Nome de usuário"
                  required={true}
                  register={register("username")}
                  type="text"
                  name="username"
                  id="username"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.username}
                  errorMessage={messages.username}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Nome"
                  required={true}
                  register={register("name")}
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.name}
                  errorMessage={messages.name}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Sobrenome"
                  required={true}
                  register={register("lastname")}
                  type="text"
                  name="lastname"
                  id="lastname"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.lastname}
                  errorMessage={messages.lastname}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="E-mail"
                  required={true}
                  register={register("email")}
                  type="text"
                  inputMode="email"
                  name="email"
                  id="email"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.email}
                  errorMessage={messages.email}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Senha"
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
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Confirmar senha"
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
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Telefone"
                  register={register("phone")}
                  type="text"
                  inputMode="numeric"
                  name="phone"
                  id="phone"
                  className="mt-1 focus:border-highlight block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  mask="(99)99999-9999"
                  error={errors.phone}
                  errorMessage={messages.phone}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Checkbox
                  value={termsOfUse}
                  setValue={setTermsOfUse}
                  className="rounded focus:border-gray h-4 w-4 text-highlight border-gray-300"
                  label="Li e ceito os "
                  link={{ label: "termos de uso", href: "/termos-de-uso" }}
                  error={errors.termsOfUse}
                  errorMessage={messages.termsOfUse}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                  onChange={onRecaptchaChange}
                />
                {errors.recaptcha && (
                  <pre>
                    <p className="text-xs font-small text-red-500">
                      {messages.recaptcha}
                    </p>
                  </pre>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 md:px-6 bg-dark-20 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-40"
            >
              Cadastrar
            </button>
            <div className="text-sm mx-4">
              Já possui uma conta?{" "}
              <button
                type="button"
                onClick={() => redirect("/login")}
                className="pointer font-medium text-highlight hover:text-highlight-40"
              >
                Faça Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
