import { useEffect, useState } from "react";
import "./App.css";
import {
  Map,
  AdvancedMarker,
  APIProvider,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import Geocoding from "./Components/Geocoding";

const API_KEY: string = process.env.VITE_GOOGLE_MAPS_API_KEY!;
const MAP_ID: string = process.env.VITE_GOOGLE_MAPS_MAP_ID!;

function App() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const onPositionUpdate = (position: GeolocationPosition) => {
    console.log(position.coords);
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    setAccuracy(position.coords.accuracy);
  };

  const handleGeolocationError = (err: GeolocationPositionError) => {
    const { code } = err;
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        // Handle Permission Denied Error
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        // Handle Position Unavailable Error
        break;
      case GeolocationPositionError.TIMEOUT:
        // Handle Timeout Error
        break;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onPositionUpdate,
        handleGeolocationError,
        { maximumAge: 5000 },
      );
    }
    console.log(navigator.geolocation);
  }, []);

  // useEffect(() => {
  //   if (!accuracy) return;
  //
  // }, [accuracy]);

  return (
    <>
      <APIProvider
        apiKey={API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        {lat && lng ? (
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
              <AdvancedMarker position={{ lat, lng }}>
                <div className="position" />
              </AdvancedMarker>
            </Map>
            <Geocoding />
          </div>
        ) : null}
      </APIProvider>
    </>
  );
}

export default App;
