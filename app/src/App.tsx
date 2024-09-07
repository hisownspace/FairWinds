import { useEffect, useState } from "react";
import "./App.css";
import { Map, APIProvider } from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding";
import LocationRange from "./Components/LocationRange";
import PositionMarker from "./Components/PositionMarker";
import DestinationControl from "./Components/DestinationControl";
import CenterControl from "./Components/CenterControl";
import Navigation from "./Components/Navigation";
import DestinationMarker from "./Components/DestinationMarker";
import StartTripControl from "./Components/StartTripControl";
import NextDirection from "./Components/NextDirection";

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
  const [heading, setHeading] = useState<number>(NaN);
  const [tracking, setTracking] = useState<boolean>(true);
  const [showStartTripButton, setShowStartTripButton] =
    useState<boolean>(false);
  const [onTrip, setOnTrip] = useState<boolean>(false);
  const [nextTurn, setNextTurn] = useState<string>("");

  useEffect(() => {
    if (!dest || !currLoc) return;
    const destIsEmpty = Object.values(dest).every((x) => !x);
    const currLocIsEmpty = Object.values(currLoc).every((x) => !x);
    if (
      destIsEmpty ||
      currLocIsEmpty ||
      JSON.stringify(currLoc) === JSON.stringify(start)
    )
      return;
    console.log(JSON.stringify(currLoc) === JSON.stringify(start));
    console.log("CHANGING START");
    console.log(
      "OLD CURRLOC:",
      `{lat: ${currLoc.lat}, lng: ${currLoc.lng}, heading: ${currLoc.heading}, accuracy: ${currLoc.accuracy} }`,
    );
    if (start)
      console.log(
        "NEW START:",
        `{lat: ${start.lat}, lng: ${start.lng}, heading: ${start.heading}, accuracy: ${start.accuracy} }`,
      );
    setStart({ ...currLoc });
  }, [currLoc, dest]);

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
              onLocSelected={setCurrLoc}
              loc={currLoc}
              tracking={tracking}
              onTracking={setTracking}
              heading={heading}
              onHeadingChange={setHeading}
              onTrip={onTrip}
            />
            <DestinationMarker dest={dest} />
          </Map>
          <DestinationControl onPlaceSelect={setAddress} />
          {!tracking && !showStartTripButton ? (
            <CenterControl onTrackingSet={setTracking} tracking={tracking} />
          ) : null}
          <StartTripControl
            showStartTripButton={showStartTripButton}
            onStartTrip={setOnTrip}
            tracking={tracking}
            onTracking={setTracking}
          />
          <Geocoding address={address} onDestSelect={setDest} />
          <LocationRange loc={currLoc} />
          <Navigation
            start={start}
            dest={dest}
            tracking={tracking}
            onTracking={setTracking}
            onShowStartTripButton={setShowStartTripButton}
            startTrip={onTrip}
            camHeading={heading}
            nextTurn={nextTurn}
            setNextTurn={setNextTurn}
          />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
