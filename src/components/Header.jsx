import { Link } from 'react-router-dom';
import Nav from './Nav';
import '../styles/Header.css';

export default function Header() {
  

  return (
    <header>
      <div id="logo"><Link to="/">Blue Coast</Link></div>
      <Nav />
    </header>
  );
}
