import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/GalleryCarousel.css";

const images = [
  {
    src: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VGVzbGF8ZW58MHx8MHx8fDA%3D",
    alt: "Car 1",
  },
  {
    src: "https://images.unsplash.com/flagged/photo-1579782647395-2e6fb36a64f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFRlc2xhfGVufDB8fDB8fHww",
    alt: "Car 2",
  },
  {
    src: "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFRlc2xhfGVufDB8fDB8fHww",
    alt: "Car 3",
  },
];

export default function GalleryCarousel() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="gallery-carousel">
      <h2>{t("home.galleryTitle")}</h2>
      <div className="carousel-container">
        <button className="carousel-btn prev" onClick={prevImage}>
          &#10094;
        </button>

        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="carousel-image"
        />

        <button className="carousel-btn next" onClick={nextImage}>
          &#10095;
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((img, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}



