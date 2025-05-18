import { useEffect } from "react";

export default function RouteMap({ from, to, onPriceCalculated, setLoading }) {
  useEffect(() => {
    if (!from || !to) return;

    let isCancelled = false;

    const fetchRouteAndPrice = async () => {
      setLoading(true);

      try {
        const forwardGeocode = async (address) => {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              address
            )}&countrycodes=FR&addressdetails=1&limit=1`
          );
          const data = await res.json();
          if (
            data &&
            data.length > 0 &&
            data[0].address.country_code === "fr"
          ) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          }
          return null;
        };

        const fromCoords = await forwardGeocode(from);
        const toCoords = await forwardGeocode(to);

        if (!fromCoords || !toCoords) {
          console.warn("Адрес(а) не найдены или вне Франции");
          if (!isCancelled) onPriceCalculated(null);
          return;
        }

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=false`
        );
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          console.warn("Маршрут не найден");
          if (!isCancelled) onPriceCalculated(null);
          return;
        }

        const distanceInKm = data.routes[0].distance / 1000;

        let pricePerKm = 3;
        if (distanceInKm > 100 && distanceInKm <= 300) pricePerKm = 2.5;
        else if (distanceInKm > 300) pricePerKm = 2.2;

        const calculatedPrice = (distanceInKm * pricePerKm).toFixed(2);

        if (!isCancelled) {
          onPriceCalculated(calculatedPrice);
        }
      } catch (err) {
        console.error("Ошибка при расчёте маршрута:", err);
        if (!isCancelled) onPriceCalculated(null);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchRouteAndPrice();

    return () => {
      isCancelled = true;
    };
  }, [from, to]);

  return null;
}
