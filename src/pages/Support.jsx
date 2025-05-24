import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import "../styles/Support.css";

export default function Support() {
  const { t } = useTranslation();
  const imageSupport =
    "https://plus.unsplash.com/premium_photo-1661962506417-f6056afac074?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGZyZW5jaCUyMHJpdmllcmF8ZW58MHx8MHx8fDA%3D";
  const textSupport = t("support.heroText");
  const buttonTextSupport = t("support.heroButton");

  return (
    <div>
      <Hero
        image={imageSupport}
        text={textSupport}
        buttonText={buttonTextSupport}
      />
      <div
        className="support-page"
        style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}
      >
        <h1>{t("support.title")}</h1>
        <p>{t("support.needHelp")}</p>
        <p>{t("support.desc")}</p>
        <h2>{t("support.commonIssues")}</h2>
        <ul>
          <li>{t("support.issue1")}</li>
          <li>{t("support.issue2")}</li>
          <li>{t("support.issue3")}</li>
        </ul>
        <p>
          <strong>{t("support.contactSupport")}:</strong>
        </p>
        <p>
          {t("support.phone", "Phone")}:{" "}
          <a href="tel:+33622649963"> +33 6 22 64 99 63</a>
        </p>
        <p>
          {t("support.email", "Email")}:{" "}
          <a href="mailto:legionvlad@icloud.com"> legionvlad@icloud.com</a>
        </p>
        <p>{t("support.responseTime")}</p>
      </div>
    </div>
  );
}
