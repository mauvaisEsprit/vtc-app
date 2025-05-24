import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import "../styles/PolitiqueConfidentialite.css";

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation();

  const imagePolitique =
    "https://images.unsplash.com/photo-1601226372175-41ff0f30bd9c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG5pY2V8ZW58MHx8MHx8fDA%3D";
  const textPolitique = t("privacy.heroText");
  const buttonPolitique = t("privacy.heroButton");

  return (
    <div>
      <Hero image={imagePolitique} text={textPolitique} buttonText={buttonPolitique} />  
    <div className="legal-container">
      <h1>{t("privacy.title")}</h1>
      <p>{t("privacy.content")}</p>
      {/* Дополнительный контент */}
    </div>
    </div>
  );
}
