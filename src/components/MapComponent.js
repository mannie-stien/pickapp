import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix default marker icon issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DEFAULT_COORDS = { lat: 43.8201, lng: -111.7924 }; // Rexburg fallback

const MapComponent = ({ events }) => {
  const [locations, setLocations] = useState({});

  useEffect(() => {
    const fetchCoords = async () => {
      const newLocations = {};

      for (const event of events) {
        const locationKey = `${event.location.name}, ${event.location.city}, ${event.location.state}, ${event.location.country}`;

        if (!locations[locationKey]) {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationKey)}`
            );

            if (response.data.length > 0) {
              newLocations[locationKey] = {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon),
              };
            } else {
              console.warn("No coordinates found for:", locationKey);
              newLocations[locationKey] = DEFAULT_COORDS;
            }
          } catch (error) {
            console.error("Error fetching coordinates:", error);
            newLocations[locationKey] = DEFAULT_COORDS;
          }
        }
      }

      setLocations((prev) => ({ ...prev, ...newLocations }));
    };

    fetchCoords();
  }, [events]);

  return (
    <MapContainer center={[DEFAULT_COORDS.lat, DEFAULT_COORDS.lng]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {events.map((event) => {
        const locationKey = `${event.location.name}, ${event.location.city}, ${event.location.state}, ${event.location.country}`;
        const coords = locations[locationKey] || DEFAULT_COORDS;

        return (
          <Marker key={event.id} position={[coords.lat, coords.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{event.title}</strong> <br />
              Location: {event.location.name}, {event.location.city} <br />
              Game Time: {new Date(event.game_time).toLocaleString()} <br />
              Level: {event.level}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
