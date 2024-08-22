import Community from "./community";
import QuemSomos from "./team";
import Footer from "../components/footer/footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <div className="pt-8 max-w-7xl mx-auto px-4 flex xs-flex-col justify-between">
        <div className="md:max-w-lg">
          <h1 className="font-crash text-4xl font font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Torneios
          </h1>
          <a
            className="mt-10 mb-10 pointer inline-block text-center rounded-md py-3 px-8 font-medium text-white bg-highlight hover:bg-highlight-60"
            onClick={() => navigate("/criar-torneio")}
          >
            Criar torneio
          </a>
        </div>
      </div>
      <Community />
      <QuemSomos />
      <Footer />
    </div>
  );
}
