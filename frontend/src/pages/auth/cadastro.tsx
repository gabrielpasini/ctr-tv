import { createRef, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Axios from "../../services/axios";
import Input from "../../components/input/input";
import { AuthContext } from "../../contexts/auth";
import Checkbox from "../../components/checkbox/checkbox";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";

export default function Cadastro() {
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
    const { confirmPassword, cpf, email, name, password, phone } = fields;

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
    if (cpf && cpf.replace(/[^\d]/g, "").length < 11) {
      errorFields.cpf = true;
      errorMessages.cpf = "Seu CPF precisa ter 11 digitos";
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
        name,
        email,
        password,
        termsOfUse,
        cpf: cpf && cpf.replace(/[^\d]/g, ""),
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
        <div className="bg-light-blue shadow mb-14 overflow-hidden rounded-md">
          <div className="px-4 py-5 bg-light-blue md:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Nome"
                  required={true}
                  register={register("name")}
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.name}
                  errorMessage={messages.name}
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
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
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
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
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
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  error={errors.confirmPassword}
                  errorMessage={messages.confirmPassword}
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="CPF"
                  register={register("cpf")}
                  type="text"
                  inputMode="numeric"
                  name="cpf"
                  id="cpf"
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                  control={control}
                  mask="999.999.999-99"
                  error={errors.cpf}
                  errorMessage={messages.cpf}
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
                  className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
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
                  className="rounded focus:border-dark-blue h-4 w-4 text-dark-blue border-gray-300"
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
          <div className="px-4 py-3 md:px-6 bg-dark-blue-20 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-dark-blue hover:bg-dark-blue-60"
            >
              Cadastrar
            </button>
            <div className="text-sm mx-4">
              Já possui uma conta?{" "}
              <button
                type="button"
                onClick={() => redirect("/login")}
                className="pointer font-medium text-dark-blue hover:text-dark-blue-60"
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
