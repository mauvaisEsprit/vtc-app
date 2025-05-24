import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const nodeRef = useRef(null);
  const intervalRef = useRef(null);
  const isHoveredRef = useRef(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const clearExistingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = useCallback(() => {
    clearExistingInterval();
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        nextImage();
      }
    }, 3500);
  }, [nextImage]);

  // Запускаем интервал при монтировании
  useEffect(() => {
    startInterval();
    return () => clearExistingInterval();
  }, [startInterval]);

  // Обработчики кнопок переключения с обнулением таймера
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startInterval(); // сброс таймера при клике
  };

  const nextImageHandler = () => {
    nextImage();
    startInterval(); // сброс таймера при клике
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    startInterval(); // сброс таймера при клике
  };

  // Остановка таймера при наведении (без сброса)
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearExistingInterval(); // остановка таймера
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    startInterval(); // запуск таймера заново
  };

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
            timeout={400}
            classNames="fade"
            nodeRef={nodeRef}
          >
            <img
              ref={nodeRef}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="carousel-image"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </CSSTransition>
        </SwitchTransition>

        <button className="carousel-btn next" onClick={nextImageHandler}>
          &#10095;
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
