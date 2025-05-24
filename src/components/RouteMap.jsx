import { useEffect, useRef } from "react";

export default function RouteMap({ from, to, onPriceCalculated, setLoading }) {
  const timeoutRef = useRef(null);
  const controllerRef = useRef(null);

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
    }, 1500);

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

      let pricePerKm = 3;
      if (distanceInKm > 100 && distanceInKm <= 300) pricePerKm = 2.5;
      else if (distanceInKm > 300) pricePerKm = 2.2;

      const calculatedPrice = (distanceInKm * pricePerKm).toFixed(2);
      onPriceCalculated(calculatedPrice);
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
