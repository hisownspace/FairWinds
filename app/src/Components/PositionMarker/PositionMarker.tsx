import { useEffect, Dispatch, SetStateAction } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords } from "../../App";

interface PosMarkProps {
  onLocSelected: Dispatch<SetStateAction<coords>>;
  loc: coords;
}

export default function PositionMarker({ onLocSelected, loc }: PosMarkProps) {
  const map = useMap();

  const onPositionUpdate = (position: GeolocationPosition) => {
    console.log(position.coords);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    onLocSelected({ lat, lng, accuracy });
  };

  const handleGeolocationError = (err: GeolocationPositionError) => {
    const { code }: { code: number } = err;
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

  useEffect(() => {
    const lat = loc.lat;
    const lng = loc.lng;

    if (!map || !lat || !lng) return;

    map.setCenter({ lat, lng });
  }, [loc]);

  return loc.lat && loc.lng ? (
    <AdvancedMarker position={{ lat: loc.lat, lng: loc.lng }}>
      <div className="position" />
    </AdvancedMarker>
  ) : null;
}
