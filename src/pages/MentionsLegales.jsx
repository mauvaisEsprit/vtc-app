import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import '../styles/MentionsLegales.css'; 

export default function MentionsLegales() {
  const { t } = useTranslation();

  const imageMentions =
    "https://images.unsplash.com/photo-1643914729809-4aa59fdc4c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmljZXxlbnwwfHwwfHx8MA%3D%3D";
  const textMentions = t("legal.heroText");
  const buttonMentions = t("legal.heroButton");


  return (
    <div>
      <Hero image={imageMentions} text={textMentions} buttonText={buttonMentions} />
     <div className="mentions-container">
        <h1>{t("legal.title")}</h1>
        <p>{t("legal.content")}</p>
      </div>
    </div>
  );
}
