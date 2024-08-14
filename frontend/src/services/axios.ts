import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

api.interceptors.request.use(
  (config) => {
    if (config.url !== "/my-content/continue-watching") {
      document.body.insertAdjacentHTML(
        "afterbegin",
        `
      <div id="loader" class="loader-bg">
        <img src="/assets/images/logo_300x300_NOBG.png" class="loader-icon" />
      </div>
      `
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.config.url !== "/my-content/continue-watching") {
      const loader = document.getElementById("loader") as Node;
      document.body.removeChild(loader);
      if (response?.data?.showMessage && response?.data?.success) {
        const snackbar = document.getElementById("snackbar") as HTMLElement;
        snackbar.innerHTML = `<img src="/assets/icons/success.svg" class="icon"/><span class="message">${response.data.success}</span>`;
        snackbar.className = "show success";
        setTimeout(function () {
          snackbar.className = snackbar.className.replace("show", "");
        }, 5000);
      }
    }
    return response;
  },
  (error) => {
    const loader = document.getElementById("loader") as Node;
    document.body.removeChild(loader);
    if (error?.response?.data?.showMessage && error?.response?.data?.error) {
      const snackbar = document.getElementById("snackbar") as HTMLElement;
      snackbar.innerHTML = `<img src="/assets/icons/error.svg"/ class="icon"><span class="message">${error.response.data.error}</span>`;
      snackbar.className = "show error";
      setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
      }, 5000);
    }
    return Promise.reject(error);
  }
);

function Client() {
  const token = Cookies.get("ctrtv-token");
  if (token)
    // @ts-ignore: Types do axios se perdendo
    api.defaults.headers["Authorization"] = `Bearer ${token}`;

  return api;
}

const Axios = Client();

export default Axios;
