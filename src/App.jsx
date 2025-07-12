import React from 'react';
import HospitalMap from './Components/HospitalMap';
import 'leaflet/dist/leaflet.css';
// import 'index.css';


function App() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🏥 BPKIHS PATH MAP</h1>
      <HospitalMap />
    </div>
  );
}

export default App;

