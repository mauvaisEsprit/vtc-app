import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";

export default function RouteMap({ from, to, onPriceCalculated, setLoading }) {
  const timeoutRef = useRef(null);
  const controllerRef = useRef(null);

  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Цены (если есть такая коллекция)
    axios
      .get("https://backtest1-0501.onrender.com/api/admin/settings", {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then((res) => {
        setSettings(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Если from или to пустые - сбрасываем цену и загрузку
    if (!from || !to) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (controllerRef.current) controllerRef.current.abort();

      onPriceCalculated(null);
      setLoading(false);
      return;
    }

    // Очистить предыдущий таймаут и запрос
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    timeoutRef.current = setTimeout(() => {
      calculateRoute();
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [from, to]);

  const calculateRoute = async () => {
    setLoading(true);
    controllerRef.current = new AbortController();

    try {
      const fetchCoords = async (address) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&countrycodes=FR&addressdetails=1&limit=1`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "vtc-app",
            Referer: window.location.href,
          },
          signal: controllerRef.current.signal,
        });
        const data = await response.json();

        if (data.length === 0) {
          console.warn(`Адрес "${address}" не найден`);
          return null;
        }
        if (!data[0].address || data[0].address.country_code !== "fr") {
          console.warn(`Адрес "${address}" не во Франции`);
          return null;
        }

        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      };

      const fromCoords = await fetchCoords(from);
      const toCoords = await fetchCoords(to);

      if (!fromCoords || !toCoords) {
        onPriceCalculated(null);
        return;
      }

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=false`;
      const res = await fetch(osrmUrl, {
        signal: controllerRef.current.signal,
      });
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn("Маршрут не найден");
        onPriceCalculated(null);
        return;
      }

      const distanceInKm = data.routes[0].distance / 1000;
      console.log("Расстояние в км:", distanceInKm);

      const calculatePrice = (distanceInKm, settings) => {
        if (!settings?.pricePerKm) return 0;

        let basePrice = settings.pricePerKm;
        let minPriceForEnter = settings.minFare;
        let pricePerKm;
        console.log(settings);

        if (distanceInKm <= 100) {
          pricePerKm = basePrice * 1.3 ;
          console.log("Цена за км (до 100):", pricePerKm);
        } else if (distanceInKm <= 300) {
          pricePerKm = basePrice * 1.15;
          console.log("Цена за км (до 300):", pricePerKm);
        } else {
          pricePerKm = basePrice;
          console.log("Цена за км (более 300):", pricePerKm);
        }
        console.log("Минимальная цена за вход:", minPriceForEnter);
        console.log("Расстояние в км:", distanceInKm);
        console.log("Цена за км:", pricePerKm);
        
        const calculatedPrice = parseFloat((distanceInKm * pricePerKm + minPriceForEnter).toFixed(2));
        return calculatedPrice;
      };

      // Пример использования:
      const finalPrice = calculatePrice(distanceInKm, settings);
      onPriceCalculated(finalPrice);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Ошибка маршрута:", err);
        onPriceCalculated(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return null;
}
