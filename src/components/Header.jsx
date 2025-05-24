import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/Header.css";

export default function Header() {
  const ScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header>
      <div id="logo" onClick={ScrollToTop}>
        <Link to="/">Blue Coast</Link>
      </div>
      <Nav />
    </header>
  );
}
