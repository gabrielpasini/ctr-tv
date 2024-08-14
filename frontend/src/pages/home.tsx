import Footer from "../components/footer/footer";
import Comunidade from "./comunidade";
import QuemSomos from "./quem-somos";

export default function Home() {
  return (
    <div className="min-h-full">
      <Comunidade />
      <QuemSomos />
      <Footer />
    </div>
  );
}
