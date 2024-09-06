import { useEffect, useState } from "react";
import "./App.css";
import {
  Map,
  APIProvider,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding";
import LocationRange from "./Components/LocationRange";
import PositionMarker from "./Components/PositionMarker";
import DestinationControl from "./Components/DestinationControl";
import CenterControl from "./Components/CenterControl";
import Navigation from "./Components/Navigation";
import DestinationMarker from "./Components/DestinationMarker";
import StartTripControl from "./Components/StartTripControl";

export const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;
const MAP_ID: string = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID!;

export interface coords {
  lat: number;
  lng: number;
  heading: number | null;
  accuracy: number;
}

function App() {
  const [currLoc, setCurrLoc] = useState<coords>({} as coords);
  const [dest, setDest] = useState<coords>({} as coords);
  const [start, setStart] = useState<coords>();
  const [address, setAddress] = useState<string>("");
  const [tracking, setTracking] = useState(true);
  const [showStartTripButton, setShowStartTripButton] =
    useState<boolean>(false);
  const [onTrip, setOnTrip] = useState<boolean>(false);

  useEffect(() => {
    if (!dest || !currLoc) return;
    setStart(currLoc);
  }, [start, dest]);

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
          >
            <PositionMarker
              onLocSelected={setCurrLoc}
              loc={currLoc}
              tracking={tracking}
              onTracking={setTracking}
            />
            <DestinationMarker dest={dest} />
          </Map>
          <DestinationControl onPlaceSelect={setAddress} />
          <CenterControl onTrackingSet={setTracking} tracking={tracking} />
          <StartTripControl
            showStartTripButton={showStartTripButton}
            onStartTrip={setOnTrip}
            tracking={tracking}
          />
          <Geocoding address={address} onDestSelect={setDest} />
          <LocationRange loc={currLoc} />
          <Navigation
            start={start}
            dest={dest}
            onTracking={setTracking}
            onShowStartTripButton={setShowStartTripButton}
            startTrip={onTrip}
          />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
