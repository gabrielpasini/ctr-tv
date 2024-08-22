import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ForgetPassword from "../../components/modals/forget-password";
import { AuthContext } from "../../contexts/auth";
import RecaptchaModal from "../../components/modals/recaptcha";

type AuthTypes = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { authenticate } = useContext(AuthContext);
  const [showForgetPasswordModal, setShowForgetPasswordModal] =
    useState<boolean>(false);
  const [showRecaptchaModal, setShowRecaptchaModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [authData, setAuthData] = useState<AuthTypes>();

  function handleSignIn(data: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    setShowRecaptchaModal(true);
    setAuthData(data);
  }

  async function completeLogin() {
    try {
      if (authData) {
        await authenticate({ ...authData });
      }
    } catch (err) {
      throw err;
    }
  }

  function redirect(route: string) {
    navigate(route);
  }

  return (
    <>
      {showForgetPasswordModal && (
        <ForgetPassword
          open={showForgetPasswordModal}
          setOpen={setShowForgetPasswordModal}
        />
      )}
      {showRecaptchaModal && (
        <RecaptchaModal
          open={showRecaptchaModal}
          setOpen={setShowRecaptchaModal}
          onComplete={completeLogin}
        />
      )}
      <div className="bg-light h-screen min-h-full flex items-start justify-center py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div>
            <img
              style={{ filter: "drop-shadow(8px 8px 10px #222)" }}
              className="mx-auto"
              src="https://i.imgur.com/NSVuZuY.png"
              alt="logo"
              width="70%"
            />
            <h2 className="text-center text-xl font-extrabold text-gray-900">
              Faça login na sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ou{" "}
              <button
                type="button"
                onClick={() => redirect("/")}
                className="pointer font-medium text-highlight hover:text-highlight-40"
              >
                conheça a plataforma antes
              </button>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(handleSignIn)}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Nome de usuário
                </label>
                <input
                  {...register("username")}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  id="username"
                  name="username"
                  type="string"
                  autoComplete="off"
                  required
                  className="focus:outline-none focus:ring-0 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:border-highlight focus:z-10 md:text-sm"
                  placeholder="Nome de usuário"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  required
                  className="focus:outline-none focus:ring-0 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:border-highlight focus:z-10 md:text-sm"
                  placeholder="Senha"
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight-60"
            >
              Entrar
            </button>
            <div className="text-sm flex items-end justify-end">
              <button
                type="button"
                onClick={() => setShowForgetPasswordModal(true)}
                className="pointer font-medium text-highlight hover:text-highlight-40"
              >
                Esqueceu sua senha?
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-sm">
                É novo por aqui?{" "}
                <button
                  type="button"
                  onClick={() => redirect("/cadastro")}
                  className="pointer font-medium text-highlight hover:text-highlight-40"
                >
                  Cadastre-se!
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
