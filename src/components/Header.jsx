import { Link } from 'react-router-dom';
import Nav from './Nav';
import '../styles/Header.css';
import BurgerMenu from './BurgerMenu';

export default function Header() {
  

  return (
    <header>
      <div id="logo"><Link to="/">Blue Coast</Link></div>
      <BurgerMenu />
      <Nav />
    </header>
  );
}
