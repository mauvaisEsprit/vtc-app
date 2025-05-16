import '../styles/BurgerMenu.css';

export default function BurgerMenu() {

    const [navOpen, setNavOpen] = useState(false);
    
    return (
        <div className="burger-menu" onClick={() => setNavOpen(!navOpen)}>
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
      </div>
    );
}