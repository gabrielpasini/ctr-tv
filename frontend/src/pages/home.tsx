import Community from "./community";
import QuemSomos from "./team";
import Footer from "../components/footer/footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <a
        className="mt-10 mb-10 ml-10 pointer inline-block text-center rounded-md py-3 px-8 font-medium text-white bg-highlight hover:bg-highlight-60"
        onClick={() => navigate("/criar-torneio")}
      >
        Criar torneio
      </a>
      <Community />
      <QuemSomos />
      <Footer />
    </div>
  );
}
