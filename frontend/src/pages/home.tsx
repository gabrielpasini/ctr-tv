import Community from "./community";
import QuemSomos from "./team";
import Footer from "../components/footer/footer";

export default function Home() {
  return (
    <div className="min-h-full">
      <Community />
      <QuemSomos />
      <Footer />
    </div>
  );
}
