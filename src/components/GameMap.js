import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaUsers } from "react-icons/fa";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to handle auto-zooming to userLocation
const AutoZoomToLocation = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      const { latitude, longitude } = userLocation;
      map.setView([latitude, longitude], 13); // Set the map view to userLocation with a zoom level of 13
    }
  }, [userLocation, map]);

  return null; // This component doesn't render anything
};

const GameMap = ({ userLocation, games }) => {
  // console.log("GameMap Props:", { userLocation, games }); // Debugging: Check props

  // Convert userLocation object to array [latitude, longitude] for MapContainer center
  const center =
    userLocation && userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : [0, 0]; // Fallback to [0, 0] if userLocation is invalid

  return (
    <div style={{ height: "400px", width: "100%", marginBottom: "2rem" }}>
      <MapContainer
        center={center} // Initial center (fallback if userLocation is not available)
        zoom={13} // Initial zoom level
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-zoom to userLocation */}
        <AutoZoomToLocation userLocation={userLocation} />

        {/* Render game markers */}
        {games.map((game) => {
          if (!game.coords || !Array.isArray(game.coords)) return null; // Skip games without valid coordinates

          const [lng, lat] = game.coords; // Extract coordinates
          return (
            <Marker key={game.id} position={[lat, lng]}>
              <Popup>
                <strong>{game.title}</strong>
                <br />
                {/* {game.location.city} */}
                <br />
                <FaUsers /> {game.current_attendees}/{game.max_attendees} attendees
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GameMap;