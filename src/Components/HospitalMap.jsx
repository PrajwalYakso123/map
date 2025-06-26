

// export default HospitalMap;
import React from 'react';
import { MapContainer, Polyline, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import hospitalPaths from '../Data/Hospitalpaths'; // Adjust path if needed


const HospitalMap = () => {
  const position = [26.8120, 87.2689]; // Center position (BPKIHS)

  // Define building names for color differentiation
  const buildingNames = [
    "Bill Counter", "Main Gate", "Emergency", "OPD",
    "Hospital Pharmacy", "Hospital Canteen", "Gate2", "BPKIHS"
  ];

  return (
    <div className="h-[600px] w-full border-2 border-gray-300 rounded-lg shadow-lg mt-4">
      <MapContainer 
        center={position} 
        zoom={25  } 
        className="h-full w-full" 
        style={{ backgroundColor: '#f0f0f0' }} // light gray background
      >
        {hospitalPaths.features.map((feature, index) => {
          const isBuilding = buildingNames.includes(feature.properties.name);

          return (
            <Polyline
              key={index}
              positions={feature.geometry.coordinates.map(coord => [coord[1], coord[0]])} // [lat, lng]
              pathOptions={{
                color: isBuilding ? 'blue' : 'red', // blue for buildings, red for paths
                weight: isBuilding ? 3 : 4,
                opacity: 0.8
              }}
            >
              <Tooltip 
                permanent
                direction="top"
                className="text-xs font-bold text-blue-800 bg-white px-2 py-1 rounded shadow"
              >
                {feature.properties.name ? feature.properties.name : "Unnamed Feature"}
              </Tooltip>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HospitalMap;



