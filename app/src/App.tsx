import { useEffect, useState } from "react";
import "./App.css";
import {
  Map,
  APIProvider,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding/Geocoding";
import LocationRange from "./Components/LocationRange/LocationRange";
import PositionMarker from "./Components/PositionMarker/PositionMarker";
import DestinationControl from "./Components/DestinationControl";

const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;
const MAP_ID: string = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID!;

export interface coords {
  lat: number;
  lng: number;
  accuracy: number;
}

function App() {
  const [currLoc, setCurrLoc] = useState<coords>({} as coords);
  const [dest, setDest] = useState<coords>({} as coords);
  // const [start, setStart] = useState<coords>();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    console.log(dest);
  }, [dest]);

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
            defaultCenter={{ lat: 0, lng: 0 }}
            fullscreenControl={false}
            mapTypeControl={false}
            onCameraChanged={(e: MapCameraChangedEvent) => {
              console.log(
                "camera changed:",
                e.detail.center,
                "zoom:",
                e.detail.zoom,
              );
            }}
          >
            <PositionMarker onLocSelected={setCurrLoc} loc={currLoc} />
          </Map>
          <DestinationControl onPlaceSelect={setAddress} />
          <Geocoding address={address} onDestSelect={setDest} />
          <LocationRange loc={currLoc} />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
