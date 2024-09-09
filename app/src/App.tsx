import { useEffect, useState } from "react";
import "./App.css";
import { Map, APIProvider } from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding";
import LocationRange from "./Components/LocationRange";
import PositionMarker from "./Components/PositionMarker";
import {
  DestinationControl,
  CenterControl,
  StartTripControl,
} from "./Components/Controls";
import Navigation from "./Components/Navigation";
import DestinationMarker from "./Components/DestinationMarker";
import NextDirection from "./Components/NextDirection";

export const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;
const MAP_ID: string = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID!;

export interface coords {
  lat: number;
  lng: number;
  bearing: number | null;
  accuracy: number;
}

function App() {
  const [currPos, setCurrPos] = useState<coords>({} as coords);
  const [dest, setDest] = useState<coords>({} as coords);
  const [start, setStart] = useState<coords>();
  const [address, setAddress] = useState<string>("");
  const [heading, setHeading] = useState<number>(NaN);
  const [tracking, setTracking] = useState<boolean>(true);
  const [showStartTripButton, setShowStartTripButton] =
    useState<boolean>(false);
  const [onTrip, setOnTrip] = useState<boolean>(false);
  const [nextTurn, setNextTurn] = useState<string>("");

  useEffect(() => {
    if (!dest || !currPos) return;
    const destIsEmpty = Object.values(dest).every((x) => !x);
    const currPosIsEmpty = Object.values(currPos).every((x) => !x);
    if (
      destIsEmpty ||
      currPosIsEmpty ||
      JSON.stringify(currPos) === JSON.stringify(start)
    )
      return;
    setStart({ ...currPos });
  }, [currPos, dest]);

  return (
    <>
      <NextDirection nextTurn={nextTurn} />
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
              onPosUpdate={setCurrPos}
              pos={currPos}
              tracking={tracking}
              onTrackingChange={setTracking}
              heading={heading}
              onHeadingChange={setHeading}
              onTrip={onTrip}
            />
            <DestinationMarker dest={dest} />
          </Map>
          <DestinationControl onPlaceSelect={setAddress} />
          {!tracking && !showStartTripButton ? (
            <CenterControl onTrackingChange={setTracking} tracking={tracking} />
          ) : null}
          {showStartTripButton && !tracking ? (
            <StartTripControl
              onStartTripSelected={setOnTrip}
              onTrackingChange={setTracking}
            />
          ) : null}
          <Geocoding address={address} onDestSelect={setDest} />
          <LocationRange loc={currPos} />
          <Navigation
            start={start}
            dest={dest}
            tracking={tracking}
            onTrackingChange={setTracking}
            onShowStartTripButton={setShowStartTripButton}
            startTrip={onTrip}
            camHeading={heading}
            nextTurn={nextTurn}
            onNewNextTurn={setNextTurn}
          />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
