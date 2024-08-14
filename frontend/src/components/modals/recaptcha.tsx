import { Dispatch, SetStateAction, createRef } from "react";
import { Dialog } from "@headlessui/react";
import ReCAPTCHA from "react-google-recaptcha";

type ModalTypes = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onComplete: () => void;
};

export default function RecaptchaModal({
  open,
  setOpen,
  onComplete,
}: ModalTypes) {
  const recaptchaRef = createRef<ReCAPTCHA>();

  async function onChange(token: string | null) {
    if (token !== null) {
      onComplete();
      setOpen(false);
      return;
    }

    recaptchaRef.current?.reset();
  }

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={open}
      onClose={() => undefined}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center md:block md:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <span
          className="hidden md:inline-block md:align-middle md:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="w-full relative inline-block align-bottom bg-light rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:my-8 md:align-middle md:max-w-lg">
          <div className="bg-light p-5 pb-4 md:p-6 md:pb-4">
            <div className="flex items-center justify-center">
              <div className="w-full text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Complete o reCAPTCHA para seguir
                </Dialog.Title>
              </div>
            </div>
            {open && (
              <div className="pt-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                  onChange={onChange}
                />
              </div>
            )}
          </div>
          <div className="bg-dark-20 px-4 py-3 md:px-6 md:flex md:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 mt-2 md:mt-0 md:ml-3 md:w-auto md:text-sm"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
