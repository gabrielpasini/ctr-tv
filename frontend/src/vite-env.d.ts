/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly URL_API: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_RECAPTCHA_KEY: string;
  readonly VITE_BACKEND_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
