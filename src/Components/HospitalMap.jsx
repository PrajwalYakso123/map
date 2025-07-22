
import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import hospitalPaths from '../Data/Hospitalpaths';
import 'leaflet/dist/leaflet.css';
import AnimatedPath from './AnimatedPath';


const buildingNames = [
  "Building 3", "Main Gate", "Building 1", "Building 2",
  "Hospital Pharmacy", "Hospital Canteen", "Gate 2", "BPKIHS"
];
const calculateDistance = (coords) => {
  let distance = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lon1] = coords[i - 1];
    const [lat2, lon2] = coords[i];
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;
  }
  return distance.toFixed(2);
};


const HospitalMap = () => {
  const [selectedPath, setSelectedPath] = useState(null);   // destination
  const [initialPoint, setInitialPoint] = useState(null);   // source

  const center = [26.8120, 87.2689];

  const handleSelect = (e) => {
    setSelectedPath(e.target.value);
  };

  const handleInitialPointSelect = (e) => {
    setInitialPoint(e.target.value);
  };

  // Only show buildings in dropdowns
  const buildingFeatures = hospitalPaths.features.filter(f =>
    buildingNames.includes(f.properties.name)
  );

  // Get path between buildings, regardless of direction
  const filteredFeatures = hospitalPaths.features.filter(f => {
    const forward = f.properties.source === initialPoint && f.properties.destination === selectedPath;
    const reverse = f.properties.source === selectedPath && f.properties.destination === initialPoint;
    return forward || reverse;
  });

  return (
    

        <div>
          <label className="mr-2 font-medium">Initial Point:</label>
          <select onChange={handleSelect} value={selectedPath || ''} className="border rounded p-1">
            <option value="">-- Select Building --</option>
            {buildingFeatures.map((f, i) => (
              <option key={i} value={f.properties.name}>{f.properties.name}</option>
            ))}
          </select>
          <div className="w-full mt-4">
      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Destination:</label>
          <select onChange={handleInitialPointSelect} value={initialPoint || ''} className="border rounded p-1">
            <option value="">-- Select Building --</option>
            {buildingFeatures.map((f, i) => (
              <option key={i} value={f.properties.name}>{f.properties.name}</option>
            ))}
          </select>
        </div>
        </div>
      </div>
            {/* Show distance if a valid path is selected */}
        {filteredFeatures.length > 0 && (
        <p className="text-sm font-medium text-green-700 mb-2">
             Total Distance = {calculateDistance(
            filteredFeatures[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
            )} km
        </p>
        )}
        
      <div className="h-[600px] border-2 border-gray-300 rounded-lg shadow-lg">
        <MapContainer center={center} zoom={18} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Show all buildings */}
          {buildingFeatures.map((feature, index) => {
            const coords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            return (
              <Polyline
                key={`bldg-${index}`}
                positions={coords}
                pathOptions={{
                  color: '#2b6cb0',
                  weight: 4,
                  opacity: 0.9
                }}
              >
                <Tooltip permanent>{feature.properties.name}</Tooltip>
              </Polyline>
            );
          })}

          {/* Show directional path from initialPoint → selectedPath */}
          {filteredFeatures.map((feature, index) => {
            let coords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

            const { source, destination } = feature.properties;

            {initialPoint && selectedPath && initialPoint === selectedPath && (() => {
            const building = buildingFeatures.find(f => f.properties.name === initialPoint);
            if (!building) return null;

            const coords = building.geometry.coordinates[0]; // Assuming Polygon
            if (!coords || coords.length === 0) return null;

            // Calculate center of polygon
            const center = coords.reduce(
                (acc, [lng, lat]) => [acc[0] + lat / coords.length, acc[1] + lng / coords.length],
                [0, 0]
            );

           
            })()}




            // ✅ Only reverse if the path is stored in the opposite direction
            if (source === selectedPath && destination === initialPoint) {
              coords = coords.slice().reverse();
            }

            return (
              <AnimatedPath key={`path-${index}`} positions={coords}>
                <Tooltip permanent>{`${initialPoint} → ${selectedPath}`}</Tooltip>
              </AnimatedPath>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default HospitalMap;














