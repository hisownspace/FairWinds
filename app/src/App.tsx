import { useEffect, useState } from "react";
import "./App.css";
import {
  Map,
  APIProvider,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding/Geocoding";
import LocationRange from "./Components/LocationRange/LocationRange";
import Position from "./Components/Position/Position";

const API_KEY: string = process.env.VITE_GOOGLE_MAPS_API_KEY!;
const MAP_ID: string = process.env.VITE_GOOGLE_MAPS_MAP_ID!;

function App() {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  return (
    <>
      <APIProvider
        apiKey={API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <div id="map">
          <Map
            mapId={MAP_ID}
            defaultZoom={16}
            defaultCenter={{ lat, lng }}
            onCameraChanged={(e: MapCameraChangedEvent) => {
              console.log(
                "camera changed:",
                e.detail.center,
                "zoom:",
                e.detail.zoom,
              );
            }}
          >
            <Position
              onAcc={setAccuracy}
              onLat={setLat}
              onLng={setLng}
              lat={lat}
              lng={lng}
            />
          </Map>
          <Geocoding />
          <LocationRange accuracy={accuracy} lat={lat} lng={lng} />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
