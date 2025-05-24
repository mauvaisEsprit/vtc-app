import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../styles/GalleryCarousel.css";

const images = [
  {
    src: "https://images.unsplash.com/photo-1535106147748-c8da9a312c12?w=500&auto=format&fit=crop&q=60",
    alt: "Car 1",
  },
  {
    src: "https://images.unsplash.com/flagged/photo-1579782647395-2e6fb36a64f2?w=500&auto=format&fit=crop&q=60",
    alt: "Car 2",
  },
  {
    src: "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=500&auto=format&fit=crop&q=60",
    alt: "Car 3",
  },
];

export default function GalleryCarousel() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const nodeRef = useRef(null); // 👈 обязателен в React 18+

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

  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // смена изображения каждые 5 секунд
    return () => clearInterval(interval); // очистка интервала при размонтировании
  }, []);

  return (
    <section className="gallery-carousel">
      <h2>{t("home.galleryTitle")}</h2>
      <div className="carousel-container">
        <button className="carousel-btn prev" onClick={prevImage}>
          &#10094;
        </button>

        <SwitchTransition mode="out-in">
          <CSSTransition
            key={images[currentIndex].src}
            timeout={500}
            classNames="fade"
            nodeRef={nodeRef} // 👈 добавили сюда
          >
            <img
              ref={nodeRef} // 👈 и сюда
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="carousel-image"
            />
          </CSSTransition>
        </SwitchTransition>

        <button className="carousel-btn next" onClick={nextImage}>
          &#10095;
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
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
