import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import hospitalPaths from '../Data/HospitalPaths';
import 'leaflet/dist/leaflet.css';
import AnimatedPath from './AnimatedPath';

const HospitalMap = () => {
    const [selectedPath, setSelectedPath] = useState(null);
    const center = [26.8120, 87.2689];

    const handleSelect = (e) => {
        setSelectedPath(e.target.value);
    };

    return (
        <div className="w-full mt-4">
            <div className="mb-2">
                <label className="mr-2 font-medium">Select a path:</label>
                <select onChange={handleSelect} value={selectedPath || ''} className="border rounded p-1">
                    <option value="">-- All Paths --</option>
                    {hospitalPaths.features.map((f, i) => (
                        <option key={i} value={f.properties.name}>{f.properties.name}</option>
                    ))}
                </select>
            </div>

            <div className="h-[600px] border-2 border-gray-300 rounded-lg shadow-lg">
                <MapContainer center={center} zoom={18} scrollWheelZoom className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {hospitalPaths.features.map((feature, index) => {
                        const coords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                        const isSelected = selectedPath === feature.properties.name;

                        return isSelected ? (
                            <AnimatedPath key={index} positions={coords} />
                        ) : (
                            <Polyline
                                key={index}
                                positions={coords}
                                pathOptions={{
                                    color: 'gray',
                                    weight: 2,
                                    opacity: 0.6,
                                    dashArray: '4'
                                }}
                            >
                                <Tooltip permanent>{feature.properties.name}</Tooltip>
                            </Polyline>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default HospitalMap;
