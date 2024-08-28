import "./App.css";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

function App() {
  const API_KEY: string = process.env.VITE_GOOGLE_MAPS_API_KEY!;

  return (
    <>
      <APIProvider
        apiKey={API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <div id="map">
          <Map
            defaultZoom={19}
            defaultCenter={{ lat: 39.34960295960724, lng: 283.4206951237122 }}
            onCameraChanged={(e: MapCameraChangedEvent) => {
              console.log(
                "camera changed:",
                e.detail.center,
                "zoom:",
                e.detail.zoom,
              );
            }}
          />
        </div>
      </APIProvider>
    </>
  );
}

export default App;
