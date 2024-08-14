import { Dialog } from "@headlessui/react";
import { createRef, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Axios from "../../services/axios";
import Input from "../input/input";
import { validateEmail } from "../../services/string";

type ModalTypes = {
  email: string;
  open: boolean;
  setOpen: (data: boolean) => any;
};

export default function ForgetPassword({ email, open, setOpen }: ModalTypes) {
  const recaptchaRef = createRef<ReCAPTCHA>();
  const cancelButtonRef = useRef(null);
  const [emailToSend, setEmailToSend] = useState<string>(email || "");
  const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  async function onChange(token: string | null) {
    if (token !== null) {
      setIsRecaptchaValid(true);
      return;
    }

    recaptchaRef.current?.reset();
  }

  const sendEmail = async () => {
    const errorFields: { [key: string]: boolean } = {};
    const errorMessages: { [key: string]: string } = {};

    if (!emailToSend) {
      errorFields.email = true;
      errorMessages.email = "Digite um email";
    } else if (!validateEmail(emailToSend)) {
      errorFields.email = true;
      errorMessages.email = "E-mail inválido";
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
      try {
        await Axios.post("auth/forgot-password", { email: emailToSend });
        setOpen(false);
      } catch (err) {
        throw err;
      }
    }
  };

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      initialFocus={cancelButtonRef}
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center md:block md:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <span
          className="hidden md:inline-block md:align-middle md:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="w-full relative inline-block align-bottom bg-light-blue rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:my-8 md:align-middle md:max-w-lg">
          <div className="bg-light-blue p-5 pb-4 md:p-6 md:pb-4">
            <div className="flex items-center justify-center">
              <div className="w-full text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Redefinir senha
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Um e-mail de redefinição será enviado
                  </p>
                </div>
                <div className="pt-4">
                  <Input
                    label="E-mail"
                    inputMode="email"
                    required={true}
                    onFieldChange={(event) =>
                      setEmailToSend(event.target.value)
                    }
                    fieldValue={emailToSend}
                    type="text"
                    name="email"
                    id="email-address"
                    className="mt-1 focus:border-dark-blue block w-full shadow-sm md:text-sm border-gray-300 rounded-md"
                    error={errors.email}
                    errorMessage={messages.email}
                  />
                </div>
                <div className="pt-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                    onChange={onChange}
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
          </div>
          <div className="bg-dark-blue-20 px-4 py-3 md:px-6 md:flex md:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-dark-blue hover:bg-dark-blue-60 md:ml-3 md:w-auto md:text-sm"
              onClick={() => sendEmail()}
            >
              Enviar
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 mt-2 md:mt-0 md:ml-3 md:w-auto md:text-sm"
              onClick={() => setOpen(false)}
              ref={cancelButtonRef}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
