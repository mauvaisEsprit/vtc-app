import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Hero from "../components/Hero";
import "../styles/Tarifs.css";
import { useTranslation } from "react-i18next";
import axios from "axios";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

export default function Tarifs() {
  const { t, i18n } = useTranslation();

  const imageTarifs =
    "https://www.ophorus.com/UPLOADS/DESTINATIONS/13/ophorus-167985-nice_large.jpeg";

  const mapRef = useRef(null);
  const fromMarkerRef = useRef(null);
  const toMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [isInputFocusedFrom, setIsInputFocusedFrom] = useState(false);
  const [isInputFocusedTo, setIsInputFocusedTo] = useState(false);

  const reverseGeocode = useCallback(
    async (lat, lon) => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${i18n.language}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.display_name || "";
      } catch {
        return "";
      }
    },
    [i18n.language]
  );

  useEffect(() => {
    mapRef.current = L.map("map").setView([0, 0], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current.setView([latitude, longitude], 13);
      },
      () => alert(t("errors.geolocation"))
    );

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    mapRef.current.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      if (!fromMarkerRef.current) {
        fromMarkerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        const address = await reverseGeocode(lat, lng);
        if (address) setFrom(address);
      } else if (!toMarkerRef.current) {
        toMarkerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        const address = await reverseGeocode(lat, lng);
        if (address) setTo(address);
      }
    });

    return () => {
      mapRef.current.remove();
    };
  }, [t, reverseGeocode]);

  async function forwardGeocode(address) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=FR&addressdetails=1&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0 && data[0].address.country_code === "fr") {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch {
      return null;
    }
  }

  const resultRef = useRef(null);

  async function calculateRoute() {
    if (!from || !to) {
      alert(t("errors.enter_both_addresses"));
      return;
    }

    setLoading(true);

    const fromCoords = await forwardGeocode(from);
    const toCoords = await forwardGeocode(to);

    if (!fromCoords || !toCoords) {
      alert(t("errors.address_not_found"));
      setLoading(false);
      return;
    }

    if (fromMarkerRef.current) {
      mapRef.current.removeLayer(fromMarkerRef.current);
      fromMarkerRef.current = null;
    }
    if (toMarkerRef.current) {
      mapRef.current.removeLayer(toMarkerRef.current);
      toMarkerRef.current = null;
    }

    fromMarkerRef.current = L.marker(fromCoords).addTo(mapRef.current);
    toMarkerRef.current = L.marker(toCoords).addTo(mapRef.current);

    try {
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;

      const res = await fetch(routeUrl);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error(t("errors.route_not_found"));
      }

      const route = data.routes[0].geometry;
      const distanceMeters = data.routes[0].distance;
      const durationSec = data.routes[0].duration;

      const distanceKm = (distanceMeters / 1000).toFixed(2);
      const hours = Math.floor(durationSec / 3600);
      const minutes = Math.floor((durationSec % 3600) / 60);

      let pricePerKm = 3;
      if (distanceKm > 100 && distanceKm <= 300) pricePerKm = 2.5;
      else if (distanceKm > 300) pricePerKm = 2.2;

      const calculatedPrice = (distanceKm * pricePerKm).toFixed(2);

      setDistance(`${distanceKm} km`);
      setDuration(`${hours}h ${minutes}m`);
      setPrice(`€${calculatedPrice}`);

      setTimeout(() => {
        if (resultRef.current) {
          const offset = -120; // +30 для небольшого зазора
          const top =
            resultRef.current.getBoundingClientRect().top +
            window.scrollY +
            offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);

      if (routeLayerRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current);
      }

      routeLayerRef.current = L.geoJSON(route, {
        style: { color: "blue", weight: 5, opacity: 0.7 },
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(routeLayerRef.current.getBounds());
    } catch (err) {
      alert(t("errors.route_error", { error: err.message }));
    } finally {
      setLoading(false);
    }
  }

  function resetMap() {
    if (fromMarkerRef.current) {
      mapRef.current.removeLayer(fromMarkerRef.current);
      fromMarkerRef.current = null;
    }
    if (toMarkerRef.current) {
      mapRef.current.removeLayer(toMarkerRef.current);
      toMarkerRef.current = null;
    }
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    setFrom("");
    setTo("");
    setDistance("");
    setDuration("");
    setPrice("");
  }

  useEffect(() => {
    if (from.length < 3) {
      setSuggestionsFrom([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: from,
            format: "json",
            addressdetails: 1,
            limit: 5,
            countrycodes: "fr",
          },
          headers: {
            "Accept-Language": i18n.language,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSuggestionsFrom(res.data);
          } else {
            setSuggestionsFrom([]);
          }
        })
        .catch(() => setSuggestionsFrom([]));
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [from, i18n.language]);

  useEffect(() => {
    if (to.length < 3) {
      setSuggestionsTo([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: to,
            format: "json",
            addressdetails: 1,
            limit: 5,
            countrycodes: "fr",
          },
          headers: {
            "Accept-Language": i18n.language,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSuggestionsTo(res.data);
          } else {
            setSuggestionsTo([]);
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки подсказок:", error);
          setSuggestionsTo([]);
        });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [to, i18n.language]);

  const handleSelectFrom = (address) => {
    setFrom(address);
    setSuggestionsFrom([]);
  };

  const handleSelectTo = (address) => {
    setTo(address);
    setSuggestionsTo([]);
  };

  return (
    <div>
      <Hero
        image={imageTarifs}
        text={t("tarifs.hero_title")}
        buttonText={t("tarifs.hero_button")}
      />
      <div ref={resultRef}>
        <div id="tarifc">
          <h2>{t("tarifs.hero_title")}</h2>
          <div className="input-suggestion-wrapper-tarifs">
            <input
              type="text"
              id="from"
              name="from"
              placeholder={t("tarifs.from")}
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setIsInputFocusedFrom(true)}
              onBlur={() => {
                // небольшой таймер, чтобы успеть кликнуть по подсказке
                setTimeout(() => setIsInputFocusedFrom(false), 100);
              }}
              autoComplete="off"
            />

            {isInputFocusedFrom && suggestionsFrom.length > 0 && (
              <ul className="suggestions-list-tarifs">
                {suggestionsFrom.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectFrom(item.display_name)}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-suggestion-wrapper-tarifs">
            <input
              type="text"
              id="to"
              name="to"
              placeholder={t("tarifs.to")}
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setIsInputFocusedTo(true)}
              onBlur={() => {
                // небольшой таймер, чтобы успеть кликнуть по подсказке
                setTimeout(() => setIsInputFocusedTo(false), 100);
              }}
              autoComplete="off"
            />

            {isInputFocusedTo && suggestionsTo.length > 0 && (
              <ul className="suggestions-list-tarifs">
                {suggestionsTo.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectTo(item.display_name)}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={calculateRoute} disabled={loading}>
            {t("tarifs.calculate")}
          </button>
          <button onClick={resetMap} disabled={loading}>
            {t("tarifs.reset")}
          </button>

          {loading && <div className="spinner"></div>}
          {distance && (
            <div id="distance">
              {t("tarifs.distance")}: {distance}
            </div>
          )}
          {duration && (
            <div id="duration">
              {t("tarifs.duration")}: {duration}
            </div>
          )}
          {price && (
            <div id="price">
              {t("tarifs.price")}: {price}
            </div>
          )}
          <p
            style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "white" }}
          >
            * {t("tarifs.noteApproximate")}
          </p>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div id="map"></div>

        {fromMarkerRef.current && toMarkerRef.current && (
          <div className="map-buttons">
            <button onClick={calculateRoute} disabled={loading}>
              {t("tarifs.calculate")}
            </button>
            <button onClick={resetMap} disabled={loading}>
              {t("tarifs.reset")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
